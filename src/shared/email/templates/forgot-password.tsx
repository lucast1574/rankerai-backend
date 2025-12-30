// src/shared/email/templates/forgot-password.template.tsx
import { Html, Button, Text, Section, Container, Heading } from '@react-email/components';
import * as React from 'react';

interface ForgotPasswordEmailProps {
    name: string;
    resetLink: string;
}

export const ForgotPasswordEmail = ({ name, resetLink }: ForgotPasswordEmailProps) => (
    <Html>
        <Container>
            <Heading>Password Reset</Heading>
            <Text>Hi {name},</Text>
            <Text>You requested to reset your password. Click the button below to proceed:</Text>
            <Section>
                <Button href={resetLink} style={{ backgroundColor: '#000', color: '#fff', padding: '12px 20px' }}>
                    Reset Password
                </Button>
            </Section>
            <Text>If you didn't request this, please ignore this email.</Text>
        </Container>
    </Html>
);