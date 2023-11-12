import jwt, { Secret } from 'jsonwebtoken';
import Errors from '@errors/ClassError'

interface TokenPayload {
    userId: string;
    role: string;
}

const generateTokenHelper = (userId: string, role: string): string => {

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Errors.EnvironmentError('JWT_SECRET or JWT_EXPIRES_IN are not defined.');
    }

    const secret: Secret = process.env.JWT_SECRET;

    const token: Secret = jwt.sign({ userId, role }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
};

const validateToken = (token: string): TokenPayload | unknown => {

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Errors.EnvironmentError('JWT_SECRET or JWT_EXPIRES_IN are not defined.');
    }

    const secret: Secret = process.env.JWT_SECRET;

    try {
        const decoded: TokenPayload = jwt.verify(token, secret) as TokenPayload;
        return decoded
    } catch (error) {
        return error
    }
};
export { generateTokenHelper, validateToken };