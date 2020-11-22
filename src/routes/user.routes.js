const { Router } = require('express');
const router = Router();
const { checkNotAuth } = require('./auth');
const userController = require('../controllers/user.controller');

router.get('/register', checkNotAuth, userController.getRegister);

router.post('/register', checkNotAuth, userController.postRegister);

router.get('/login', checkNotAuth, userController.getLogin);

router.post('/login', checkNotAuth, userController.postLogin);

router.delete('/logout', userController.logout);

module.exports = router;