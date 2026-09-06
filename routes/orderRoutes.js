const express = require('express');
const { getOrders, getOrder, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(createOrder); // Public can create orders

router.route('/:id')
    .get(protect, getOrder);

router.route('/:id/status')
    .put(protect, updateOrderStatus);

module.exports = router;
