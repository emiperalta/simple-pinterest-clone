const express = require('express');
const router = express.Router();
const { loginValidation, registerValidation } = require('../../validation');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Image = require('../models/Image');

router.get('/register', async (req, res) => {
    res.render('register');
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.post('/register', async (req, res) => {
    try {
        await registerValidation(req.body);

        const userEmailExists = await User.findOne({ email: req.body.email });
        if (userEmailExists) return res.status(404).send(`Email already exists`)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/user/login');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    };
});

router.post('/login', async (req, res) => {
    try {
        await loginValidation(req.body);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('Email or password is wrong');

        console.log(user);

        const verifyPassword = await bcrypt.compare(req.body.password, user.password);
        if (!verifyPassword) return res.status(404).send('Email or password is wrong');

        res.redirect('/');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    };
});


module.exports = router;