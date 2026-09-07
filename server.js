const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Security headers with cross-origin image support
app.use(cors());
app.use(express.json());

// Serve static uploads folder (images, videos, assets) with video streaming support
app.use(['/api/uploads', '/uploads'], express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        if (filePath.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
        }
    }
}));

// Request logging middleware for better debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);

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

const PORT = process.env.PORT || 5010;
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
