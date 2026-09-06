const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Process a single image buffer:
 * - Resize to max width 1200px (standard e-commerce product resolution)
 * - Convert to WebP with 80% quality (reduces size by ~75% without perceptible quality loss)
 * - Save to disk and return file URL
 */
const processAndSaveImage = async (fileBuffer, originalName) => {
    const filename = `sneaker-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    await sharp(fileBuffer)
        .resize({
            width: 1200,
            fit: 'inside',
            withoutEnlargement: true
        })
        .webp({
            quality: 80,
            effort: 4
        })
        .toFile(outputPath);

    return `/uploads/${filename}`;
};

// Handle single image upload
const uploadSingle = async (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error('No image file provided');
            err.statusCode = 400;
            throw err;
        }

        const relativeUrl = await processAndSaveImage(req.file.buffer, req.file.originalname);
        
        res.status(200).json({
            success: true,
            data: {
                url: relativeUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// Handle multiple images upload
const uploadMultiple = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            const err = new Error('No image files provided');
            err.statusCode = 400;
            throw err;
        }

        const uploadPromises = req.files.map(file => processAndSaveImage(file.buffer, file.originalname));
        const urls = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            count: urls.length,
            data: {
                urls
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadSingle, uploadMultiple };
