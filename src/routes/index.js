const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const User = require('../models/User');
const path = require('path');
const fs_extra = require('fs-extra');
const { checkAuth, checkNotAuth } = require('./auth');

router.get('/', checkAuth, async (req, res) => {
    try {
        const images = await Image.find();
        res.render('index', { images: images, user: req.user });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

router.get('/upload', checkAuth, async (req, res) => {
    res.render('upload', { user: req.user.name });
});

router.post('/upload', checkAuth, async (req, res) => {
    try {
        let newImage = new Image({
            title: req.body.title,
            description: req.body.description,
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: '/img/uploads/' + req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        await newImage.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        res.render('image', { image, user: req.user });
    } catch (err) {
        res.status(400).send(`Error ${err.message}`);
    }
});

router.get('/image/:id/delete', checkAuth, async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        fs_extra.unlink(path.resolve('./src/public' + image.path));
        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

module.exports = router;