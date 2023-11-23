import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AUTH_SERVICE_NAME, AuthDto, AuthServiceClient } from '@app/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private service: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  signIn(createAuthDto: AuthDto) {
    return this.service.signIn(createAuthDto);
  }

  signUp(createAuthDto: AuthDto) {
    return this.service.signUp(createAuthDto);
  }
}
