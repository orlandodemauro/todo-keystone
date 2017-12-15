var router = require('express').Router();

router.use('/gallery', require('./gallery'));
router.use('/blog/post', require('./post'));
router.use('/blog', require('./blog'));

module.exports = router;