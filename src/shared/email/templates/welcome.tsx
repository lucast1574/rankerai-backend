import { Html, Head, Preview, Body, Container, Section, Text, Heading, Link } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Ranker AI!</Preview>
        <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
            <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px' }}>
                <Section style={{ padding: '0 48px' }}>
                    <Heading style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>
                        Welcome to Ranker AI, {name}!
                    </Heading>
                    <Text style={{ fontSize: '16px', color: '#444' }}>
                        We're thrilled to have you here. Ranker AI is designed to help you optimize and manage your projects with ease.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#444' }}>
                        Get started by exploring your dashboard and setting up your first project.
                    </Text>
                    <Link href="https://rankerai.com/dashboard" style={{ backgroundColor: '#0070f3', color: '#fff', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>
                        Go to Dashboard
                    </Link>
                </Section>
            </Container>
        </Body>
    </Html>
);