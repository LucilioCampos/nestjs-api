import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-saml';
import * as fs from 'fs';

@Injectable()
export class SAMLStrategy extends PassportStrategy(Strategy, 'saml') {
  constructor() {
    super({
      entryPoint: process.env.SAML_ENTRYPOINT,
      issuer: process.env.SAML_ISSUER,
      callbackUrl: process.env.SAML_CALLBACK,
      cert: fs.readFileSync('../../workspace/certs/saml-cert.pem', 'utf-8'),
    });
  }

  validate(profile: any): any {
    return {
      email:
        profile.email ||
        profile[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ],
      name: profile.displayName || profile.cn,
    };
  }
}
