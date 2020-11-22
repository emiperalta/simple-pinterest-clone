const Image = require('../models/Image');
const path = require('path');
const fs_extra = require('fs-extra');

exports.index = async (req, res) => {
    try {
        const images = await Image.find();
        res.render('index', { images: images, user: req.user });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
};

exports.getImage = async (req, res) => {
    res.render('upload', { user: req.user.name });
};

exports.postImage = async (req, res) => {
    try {
        let newImage = new Image({
            title: req.body.title,
            description: req.body.description,
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: '/img/uploads/' + req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        await newImage.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
};

exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        res.render('image', { image, user: req.user });
    } catch (err) {
        res.status(400).send(`Error ${err.message}`);
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        fs_extra.unlink(path.resolve('./src/public' + image.path));
        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
};
