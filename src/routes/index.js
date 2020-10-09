const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const path = require('path');
const fs_extra = require('fs-extra');

router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.render('index', { images: images });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

router.get('/upload', async (req, res) => {
    res.render('upload');
});

router.post('/upload', async (req, res) => {
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
        res.render('image', { image });
    } catch (err) {
        res.status(400).send(`Error ${err.message}`);
    }
});

router.get('/image/:id/delete', async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        fs_extra.unlink(path.resolve('./src/public' + image.path));
        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

module.exports = router;