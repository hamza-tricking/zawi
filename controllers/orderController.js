const mongoose = require('mongoose');
const Order = require('../models/Order');

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        // Public route for customers to place orders
        const orderData = { ...req.body };
        if (orderData.products && Array.isArray(orderData.products)) {
            orderData.products = orderData.products.map(item => {
                const cleaned = { ...item };
                if (cleaned.product && !mongoose.Types.ObjectId.isValid(cleaned.product)) {
                    delete cleaned.product;
                }
                return cleaned;
            });
        }
        const order = await Order.create(orderData);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        );
        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, deleteOrder };
