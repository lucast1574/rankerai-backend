import { hashPassword, verifyPassword } from '../hash.util';

describe('HashUtil', () => {
    const plainPassword = 'StrongPassword123!'
    const wrongPassword = 'WrongPassword123!'

    describe('hashPassword', () => {
        it('Should succesfully hash a password', async () => {
            const hash = await hashPassword(plainPassword);

            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');

            expect(hash).toContain('$argon2');
            expect(hash).not.toBe(plainPassword);
        });

        it('should generate different hashes for the same password (salting)', async () => {
            const hash1 = await hashPassword(plainPassword);
            const hash2 = await hashPassword(plainPassword);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('verifyPasword', () => {
        it('should return true for a correct password match', async () => {
            const hash = await hashPassword(plainPassword);
            const result = await verifyPassword(plainPassword, hash);

            expect(result).toBe(true);
        });

        it('should return false for an incorrect password match', async () => {
            const hash = await hashPassword(plainPassword);
            const result = await verifyPassword(wrongPassword, hash);

            expect(result).toBe(false);
        });

        it('should throw an error for a malformed hash', async () => {
            const hash = 'malformedHash';
            const result = await verifyPassword(plainPassword, hash);

            expect(result).toBe(false);
        });

        it('should throw an error for a null hash', async () => {
            //@ts-expect-error - testing runtime safety
            const isValid = await verifyPassword(plainPassword, null);

            expect(isValid).toBe(false);
        });

    })
})