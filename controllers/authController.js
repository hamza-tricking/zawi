const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            const err = new Error('Please provide username and password');
            err.statusCode = 400;
            throw err;
        }

        const user = await User.findOne({ username });
        if (!user) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            throw err;
        }

        // If keep connected / rememberMe is enabled, token stays valid for 365 days (1 year)
        const expiresIn = rememberMe ? '365d' : '30d';

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn }
        );

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                role: user.role,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            const err = new Error('Please provide username and password');
            err.statusCode = 400;
            throw err;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const err = new Error('Username already exists');
            err.statusCode = 400;
            throw err;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'user'
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, getMe, getUsers, createUser, deleteUser };
