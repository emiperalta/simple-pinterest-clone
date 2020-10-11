const express = require('express');
const router = express.Router();
const registerValidation = require('../../validation');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const initializePassport = require('../../passport-config');
const { checkNotAuth } = require('./auth');

initializePassport(
    passport,
    email => User.findOne({ email: email }),
    id => User.findById({ _id: id })
)

router.get('/register', checkNotAuth, (req, res) => {    
    res.render('register');
});

router.post('/register', checkNotAuth, async (req, res) => {
    try {
        await registerValidation(req.body);

        const userEmailExists = await User.findOne({ email: req.body.email });
        if (userEmailExists) return res.status(404).send('Email already exists');

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
        res.render('register', { error: err.message});
    };
});

router.get('/login', checkNotAuth, (req, res) => {
    res.render('login');
});

router.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true  
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;