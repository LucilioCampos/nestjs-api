import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AUTH_SERVICE_TOKEN } from './contracts/tokens';
import { AuthGateway } from './implementations/auth.gateway';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthGateway,
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthGateway,
    },
  ],
  exports: [AUTH_SERVICE_TOKEN],
})
export class AuthModule {}
