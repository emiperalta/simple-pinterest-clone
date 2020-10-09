const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    filename: { 
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    path: { type: String },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', ImageSchema);