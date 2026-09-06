const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
        default: []
    },
    images: {
        type: [String], // Array of image URLs/paths
        default: []
    },
    showInHero: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
