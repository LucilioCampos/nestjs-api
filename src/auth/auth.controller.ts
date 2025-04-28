// auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('saml/login')
  @UseGuards(AuthGuard('saml'))
  async samlLogin() {
    // Redirect to IdP happens automatically
  }

  @Get('saml/callback')
  @UseGuards(AuthGuard('saml'))
  async samlCallback(@Req() req) {
    return req.user; // contains the SAML profile
  }
}
