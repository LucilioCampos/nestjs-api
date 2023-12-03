import { AuthDto } from '../dto';

export type AuthToken = {
  access_token: string;
};
export interface IAuthService {
  signup(authDto: AuthDto): Promise<AuthToken>;
  signToken(userId: number, email: string): Promise<AuthToken>;
  signin(authDto: AuthDto): Promise<AuthToken>;
}
