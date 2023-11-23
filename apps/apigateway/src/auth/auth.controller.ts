import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() createAuthDto: AuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  @Post('signup')
  signUp(@Body() createAuthDto: AuthDto) {
    return this.authService.signUp(createAuthDto);
  }
}
