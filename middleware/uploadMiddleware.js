const multer = require('multer');

// Use memory storage so we can process and compress images with Sharp before writing to disk
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed.');
        error.statusCode = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB max before compression
    }
});

module.exports = upload;
