var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/users', require('./user/user.routes'));
router.use('/bank', require('./bankAccount/bankAccount.routes'));

module.exports = router;
