var User = require('../api/user/user.model');
var signToken = require('./auth').signToken;

exports.signin = function(req, res, next) {
  // req.user will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume
  var token = signToken(req.user._id);
  var user = {
    username: req.user.username,
    pocketMoney: req.user.pocketMoney
  };
  res.json({token: token, user: user});
};
