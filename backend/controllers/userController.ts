import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import User, { IUser } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// @desc    Login & get token
// @route   POST /api/users/login
// @access  Public
export const logInUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

// @desc    Register user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, user._id)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data');
    }
})

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict',
    })

    res.status(200).json({ message: 'Logout success' });
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Public
export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }

    const user = await User.findById(req.user._id);

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

// @desc    Get users
// @route   PUT /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    res.send('Get users Success');
})

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    res.send('Delete user Success');
})

// @desc    Get user by id 
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    res.send('Get user by id Success');
})

// @desc    Update user by id 
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    res.send('Update user by id Success');
})