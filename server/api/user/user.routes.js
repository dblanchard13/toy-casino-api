var router = require('express').Router();
var log = require('db.log');
var controller = require('./user.controller');
var bankController = require('../bankAccount/bankAccount.controller');
var auth = require('../../auth/auth');
var checkUser = [auth.decodeToken(), auth.getFreshUser()];

// setup boilerplate routes
router.param('id', controller.params);
router.get('/me', checkUser, controller.me);

router.route('/')
  .get(controller.get)
  .post(controller.post, bankController.post, controller.completeCreation)

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.put)
  .delete(checkUser, controller.delete)

module.exports = router;
