import { Injectable } from '@nestjs/common';

import * as argon from 'argon2';
import { AuthDto, Token } from '@app/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'apps/core/src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { IAuthService } from './contracts';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly jwtService: JwtService,
    protected readonly config: ConfigService,
  ) {}

  async signUp(authDto: AuthDto) {
    // generate the pasword hash
    const hash = await argon.hash(authDto.password);
    // save the new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });

      delete user.hash;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new RpcException('Credentials taken');
        }
      }
      throw new RpcException(error);
    }
  }

  async signIn(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new RpcException('Credentials incorrect!');

    const pwMatches = await argon.verify(user.hash, authDto.password);

    if (!pwMatches) throw new RpcException('Credentials incorrect!');

    delete user.hash;

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<Token> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      accessToken: access_token,
    };
  }
}
