var router = require('express').Router();
var log = require('db.log');
var controller = require('./bankAccount.controller');
var userController = require('../user/user.controller');
var auth = require('../../auth/auth');

// middleware for ensuring a valid token has been sent 
// and, if so, then attaching a fresh user to the request
var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(checkUser ,controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.withdraw, userController.pocketWithdrawnMoney)
  .delete(checkUser, controller.delete)

module.exports = router;
