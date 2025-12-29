import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleService } from '../google.service';
import { OAuth2Client } from 'google-auth-library';

// We tell Jest to "hijack" the Google library
jest.mock('google-auth-library');

describe('GoogleService', () => {
    let service: GoogleService;
    let mockOAuthClient: jest.Mocked<OAuth2Client>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleService,
                {
                    provide: ConfigService,
                    useValue: {
                        // Using an arrow function here solves the 'this: void' linting error
                        getOrThrow: (key: string) => {
                            if (key === 'auth.googleClientId') return 'fake-google-client-id';
                            return null;
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<GoogleService>(GoogleService);

        // Scoping the mock client from the service instance
        mockOAuthClient = (service as any).client;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return payload when token is valid', async () => {
        const mockPayload = { email: 'lucas@test.com', name: 'Lucas' };

        // Mocking the method using an arrow function style to keep 'this' safe
        mockOAuthClient.verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => mockPayload,
        });

        const result = await service.verifyToken('valid-token');

        expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
        mockOAuthClient.verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

        await expect(service.verifyToken('invalid-token')).rejects.toThrow(
            UnauthorizedException,
        );
    });
});