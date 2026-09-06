const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        // Protected route, assuming only admins can create
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
