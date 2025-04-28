import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';  // Your AuthService
import { PassportModule } from '@nestjs/passport';


describe('AuthService with SAML', () => {
    let authService: AuthService;

    const mockSAMLStrategy = {
        authenticate: jest.fn().mockImplementation((req, options, callback) => {
            callback(null, { user: { id: '123', username: 'john' } });
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule],
            providers: [
                AuthService,
                {
                    provide: 'SAML_STRATEGY',
                    useValue: mockSAMLStrategy,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });
});
