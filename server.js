const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());

// Request logging middleware for better debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('--- ERROR CAUGHT IN CENTRAL HANDLER ---');
    console.error('Error Details:', err);
    console.error('Stack Trace:', err.stack);
    console.error('---------------------------------------');
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err : {} // Send detailed error only in dev
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hamzatricks:hamzatricks@cluster0.sjxud.mongodb.net/za';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
