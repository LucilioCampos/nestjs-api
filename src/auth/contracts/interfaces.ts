import { AuthDto } from '../dto';

type AuthToken = {
  access_token: string;
};
export abstract class IAuthService {
  abstract signup(authDto: AuthDto): Promise<AuthToken>;
  abstract signToken(userId: number, email: string): Promise<AuthToken>;
  abstract signin(authDto: AuthDto): Promise<AuthToken>;
}
