import * as argon2 from 'argon2';

/**
 * Converts a plain text password into a secure Argon2 hash.
 * Used during registration and password reset.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password);
};

/**
 * Compares a plain text password with a stored hash.
 * Returns true if they match, false otherwise.
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        return await argon2.verify(hash, password);
    } catch {
        // Returns false if verification fails or hash is malformed
        return false;
    }
};