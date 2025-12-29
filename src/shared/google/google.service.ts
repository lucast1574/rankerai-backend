import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleService {
    private client: OAuth2Client;

    constructor(private configService: ConfigService) {
        // We set up the machine with our Client ID
        this.client = new OAuth2Client(
            this.configService.getOrThrow<string>('auth.googleClientId'),
        );
    }

    async verifyToken(idToken: string): Promise<TokenPayload> {
        try {
            // The machine checks the badge with Google
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: this.configService.getOrThrow<string>('auth.googleClientId'),
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new UnauthorizedException('Invalid Google token');
            }

            return payload; // Returns the user's name, email, and photo
        } catch {
            throw new UnauthorizedException('Identity verification failed');
        }
    }
}