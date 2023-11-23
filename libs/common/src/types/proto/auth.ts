/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

// export const protobufPackage = "auth";

export interface AuthDto {
  email: string;
  password: string;
}

export interface Token {
  accessToken?: string | undefined;
}

export interface UserCredentials {
  userId: string;
  email: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  signUp(request: AuthDto): Observable<Token>;

  signIn(request: AuthDto): Observable<Token>;
}

export interface AuthServiceController {
  signUp(request: AuthDto): Promise<Token> | Observable<Token> | Token;

  signIn(request: AuthDto): Promise<Token> | Observable<Token> | Token;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["signUp", "signIn"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
