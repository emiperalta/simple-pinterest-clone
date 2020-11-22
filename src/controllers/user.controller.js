const User = require('../models/User');
const registerValidation = require('../../validation');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('../../passport-config');

initializePassport(
    email => User.findOne({ email: email }),
    id => User.findById({ _id: id })
);

exports.getRegister = (req, res) => {
    res.render('register', { error: '' });
};

exports.postRegister = async (req, res) => {
    try {
        await registerValidation(req.body);

        const userEmailExists = await User.findOne({ email: req.body.email });
        if (userEmailExists)
            return res.status(404).send('Email already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/user/login');
    } catch (err) {
        res.status(400).render('register', { error: err.message });
    }
};

exports.getLogin = (req, res) => {
    try {
        const error = req.flash("error");        
        return res.render('login', { error: error });
    } catch (err) {
        res.status(400).render('login', { error: err.message });
    }
};

exports.postLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
});

exports.logout = (req, res) => {
    req.logOut();
    res.redirect('/');
};