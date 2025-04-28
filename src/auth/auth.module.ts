import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SAMLStrategy } from './strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [SAMLStrategy],
})
export class AuthModule {}