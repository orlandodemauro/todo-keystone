var router = require('express').Router();

router.use('/gallery', require('./gallery'));
router.use('/blog/post', require('./post'));

module.exports = router;