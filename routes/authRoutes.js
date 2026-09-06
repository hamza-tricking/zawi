const express = require('express');
const { login, getMe, getUsers, createUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);

// User management endpoints
router.get('/users', protect, getUsers);
router.post('/users', protect, createUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
