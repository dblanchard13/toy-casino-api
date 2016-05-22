var router = require('express').Router();
var log = require('db.log');
var controller = require('./<%= name %>.controller');
var auth = require('../../auth/auth');

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(checkUser ,controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.put)
  .delete(checkUser, controller.delete)

module.exports = router;
