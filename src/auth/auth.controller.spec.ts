import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // If you have an AuthService
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock the AuthGuard
class MockAuthGuard {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, username: 'testuser', email: 'testuser@example.com' }; // Mock user object
    return true; // Allow the request to pass
  }
}

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService], // Provide the AuthService if needed
    })
      .overrideGuard(AuthGuard('saml')) // Override the AuthGuard with the mock
      .useClass(MockAuthGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return user on saml/callback', async () => {
    const req = { user: { id: 1, username: 'testuser', email: 'testuser@example.com' } };
    const result = await authController.samlCallback(req as any);
    expect(result).toEqual(req.user); // The response should be the mocked user
  });

  it('should trigger samlLogin', async () => {
    // Test the samlLogin route, in this case, it should just redirect
    const req = {}; // You can pass any mock request if needed
    const result = await authController.samlLogin();
    expect(result).toBeUndefined(); // As the samlLogin method doesn't return anything
  });
});
