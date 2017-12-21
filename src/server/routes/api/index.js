var router = require('express').Router();

router.use('/gallery', require('./gallery'));
router.use('/blog/post', require('./post'));
router.use('/blog', require('./blog'));
router.use('/user', require('./user'));
router.use('/auth', require('./auth'));

module.exports = router;