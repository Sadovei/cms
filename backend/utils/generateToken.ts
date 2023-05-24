import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' })

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    })
}

export default generateToken;