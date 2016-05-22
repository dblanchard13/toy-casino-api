var BankAccount = require('./bankAccount.model');
var _ = require('lodash');
var log = require('db.log');

exports.params = function(req, res, next, id){
  BankAccount.findById(id)
    .populate('owner', 'username')
    .exec()
    .then(function(bankAccount) {
      if(!bankAccount){
        next(new Error('No bankAccount with that id'));
      }
      else{
        req.bankAccount = bankAccount;
        next();
      }
    },
    function(err){
      next(err);
    });
};

exports.get = function(req, res, next){
  log.info(req.params);
  BankAccount.find({})
    .populate('owner', 'username')
    .exec()
    .then(function(bankAccounts){
      res.json(bankAccounts);
    },
    function(err){
      next(err);
    });
};

exports.getOne = function(req, res, next){
  var bankAccount = req.bankAccount;
  res.json(bankAccount);
};

exports.withdraw = function(req, res, next){
  var bankAccount = req.bankAccount;

  bankAccount.balance -= req.body.amount;

  bankAccount.save(function(err, saved){
    if(err){
      next(err);
    }
    else{
      req.savedBank = saved;
      next();
    }
  });
};

exports.post = function(req, res, next){
  var newBankAccount = {
    owner: req.user._id
  };

  BankAccount.create(newBankAccount)
    .then(function(bankAccount){
      req.bankAccount = bankAccount;
      next();
    },
    function(err) {
      log.error(err);
      next(err);
    });
};

exports.delete = function(req, res, next){
  req.bankAccount.remove(function(err, removed){
    if(err){
      next(err);
    }
    else{
      res.json(removed);
    }
  });
};
