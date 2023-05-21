import { Request, Response, NextFunction } from "express";
import { CastError } from "mongoose";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (err: CastError, req: Request, res: Response) => {
    // If the status code is 200, set it to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // If the status code is 500, set the message to "Resource not found"
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = 400;
    }

    res.status(statusCode);
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? "Love" : err.stack
    });
}