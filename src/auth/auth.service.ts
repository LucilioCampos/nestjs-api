import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthGateway } from './implementations/auth.gateway';
import { AUTH_SERVICE_TOKEN } from './contracts/tokens';
@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: AuthGateway) {}

  signup(authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  signin(authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  signToken(userId: number, email: string) {
    return this.authService.signToken(userId, email);
  }
}
