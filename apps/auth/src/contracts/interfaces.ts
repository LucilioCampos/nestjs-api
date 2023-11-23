import { AuthDto, Token } from '@app/common';

export interface IAuthService {
  signUp(authDto: AuthDto): Promise<Token>;
  signToken(userId: number, email: string): Promise<Token>;
  signIn(authDto: AuthDto): Promise<Token>;
}
