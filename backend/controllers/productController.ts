import { Request, Response } from 'express';
import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.json(products);
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(new mongoose.Types.ObjectId(req.params.id));

    if (!product) {
        res.status(404);
        throw new Error('Resource not found');
    }
    res.json(product);
});