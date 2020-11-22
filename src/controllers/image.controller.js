const Image = require('../models/Image');
const path = require('path');
const fs_extra = require('fs-extra');

exports.index = async (req, res) => {
    try {
        const images = await Image.find();
        return res.render('index', {
            images: images,
            user: req.user,
            error: '',
        });
    } catch (err) {
        return res.status(400).render('index', {
            images: [],
            user: req.user,
            error: err.message,
        });
    }
};

exports.getImage = async (req, res) => {
    try {
        return res.render('upload', { user: req.user.name, error: '' });
    } catch (err) {
        return res.status(400).render('upload', {
            user: req.user.name,
            error: err.message,
        });
    }
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
        return res.redirect('/');
    } catch (err) {
        return res.status(400).send(`Error: ${err.message}`);
    }
};

exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        return res.render('image', { image: image, user: req.user, error: '' });
    } catch (err) {
        return res.status(400).render('image', {
            image: '',
            user: req.user,
            rror: err.message,
        });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        fs_extra.unlink(path.resolve('./src/public' + image.path));
        return res.redirect('/');
    } catch (err) {
        return res.status(400).send(`Error: ${err.message}`);
    }
};
