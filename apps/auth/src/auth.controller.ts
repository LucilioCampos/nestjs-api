import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthDto,
  AuthServiceController,
  AuthServiceControllerMethods,
} from '@app/common';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private authService: AuthService) {}

  signUp(authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  signIn(authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
