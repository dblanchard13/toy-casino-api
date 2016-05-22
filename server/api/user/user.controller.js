var User = require('./user.model');
var _ = require('lodash');
var log = require('db.log');
var signToken = require('../../auth/auth').signToken;

exports.params = function(req, res, next, id){
  User.findById(id)
    .select('-password')
    .populate('accounts', 'balance')
    .exec()
    .then(function(user) {
      if(!user){
        next(new Error('No user with that id'));
      }
      else{
        req.user = user;
        next();
      }
    },
    function(err){
      next(err);
    });
};

exports.get = function(req, res, next){
  User.find({})
    .select('-password')
    .exec()
    .then(function(users){
      res.json(users.map(function(user){
        return user.toJson();
      }));
    },
    function(err){
      next(err);
    });
};

exports.getOne = function(req, res, next){
  var user = req.user.toJson();
  res.json(user);
};

exports.pocketWithdrawnMoney = function(req, res, next){
  var id = req.body.userId;

  User.findById(id)
    .then(function(user){
      user.pocketMoney += req.body.amount;

      user.save(function(err, saved) {
        if(err){
          next(err);
        }
        else{
          res.json(saved.toJson());
        }
      });
    },
    function(err){
      next(err);
    });
};

exports.put = function(req, res, next){
  var user = req.user;

  var update = req.body;

  _.merge(user, update);

  user.save(function(err, saved) {
    if(err){
      next(err);
    }
    else{
      res.json(saved.toJson());
    }
  });
};


exports.post = function(req, res, next){
  var newUser = new User(req.body);

  newUser.save(function(err, user){
    if(err) { return next(err);}
    res.token = signToken(user._id);
    req.user = user;
    next();
  });
};

// Associate the user's bank account back to the user
exports.completeCreation = function(req, res, next){
  var user = req.user;

  user.accounts = [req.bankAccount];

  user.save(function(err, saved){
    if(err){ return next(err); }
    log.info('saved user: ', saved);

    res.json({token: res.token});
  });

};

exports.delete = function(req, res, next){
  req.user.remove(function(err, removed){
    if(err){
      next(err);
    }
    else{
      res.json(removed.toJson());
    }
  });
};

exports.me = function(req, res){
  res.json(req.user.toJson());
};
