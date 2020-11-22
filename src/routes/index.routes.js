const { Router } = require('express');
const router = Router();
const { checkAuth } = require('./auth');
const imageController = require('../controllers/image.controller');

router.get('/', checkAuth, imageController.index);

router.get('/upload', checkAuth, imageController.getImage);

router.post('/upload', checkAuth, imageController.postImage);

router.get('/image/:id', imageController.getImageById);

router.get('/image/:id/delete', checkAuth, imageController.deleteImage);

module.exports = router;
