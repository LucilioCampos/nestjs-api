import { User } from '@prisma/client';
import { AuthToken, IAuthService } from '../contracts';
import { AuthDto } from '../dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common';

export class AuthGatewayTest implements IAuthService {
  users: Partial<User>[] = [];

  async signup(authDto: AuthDto): Promise<AuthToken> {
    if (!authDto.email || !authDto.password) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    const user = this.users.find((u) => u.email === authDto.email);

    if (user) {
      throw new ForbiddenException('Credentials taken');
    }

    const newUser = { id: this.users.length + 1, ...authDto };
    this.users.push(newUser);
    return this.signToken(newUser.id, newUser.email);
  }
  signToken(userId: number, email: string): Promise<AuthToken> {
    return Promise.resolve({ access_token: `${userId}${email}` });
  }
  signin(authDto: AuthDto): Promise<AuthToken> {
    const user = this.users.find((u) => u.email === authDto.email);

    if (!user) throw new ForbiddenException('Credentials incorrect!');

    delete user.hash;

    return this.signToken(user.id, user.email);
  }
}
