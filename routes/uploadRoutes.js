const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for single image upload: POST /upload or /api/upload
router.post('/', protect, upload.single('image'), uploadSingle);

// Route for multiple images upload: POST /upload/multiple or /api/upload/multiple
router.post('/multiple', protect, upload.array('images', 8), uploadMultiple);

module.exports = router;
