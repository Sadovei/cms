import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from './asyncHandler.js';
import User, { IUser } from '../models/userModel.js';

// Define a new interface to extend the Request type
interface AuthenticatedRequest extends Request {
    user?: IUser;
}


// Protect routes - user must be logged in
export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Read the JWT token from the cookie
    const token = req.cookies.jwt;

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

            // Get the user from the database
            const user = await User.findById((decoded as { userId: string }).userId).select('-password');

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Admin middleware - user must be logged in and be an admin
export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};
