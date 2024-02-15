import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { AUTH_SERVICE_TOKEN } from './contracts/tokens';
import { IAuthService } from './contracts';
import { Response } from 'express';
import { HttpStatusCode } from 'axios';

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
  async signin(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.signin(authDto);
    response.cookie('CID', access_token);
    return HttpStatusCode.Accepted;
  }
}
