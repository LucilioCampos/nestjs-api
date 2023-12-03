import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { AUTH_SERVICE_TOKEN } from './contracts/tokens';
import { IAuthService } from './contracts';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signin(authDto);
  }
}
