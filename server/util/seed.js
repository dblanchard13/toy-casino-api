var User = require('../api/user/user.model');
var BankAccount = require('../api/bankAccount/bankAccount.model');

var _ = require('lodash');
var log = require('db.log');

log.info('Seeding the Database');

var users = [
  {username: 'david', password: 'test', pocketMoney: 13},
  {username: 'jack', password: 'test', pocketMoney: 100},
  {username: 'nick', password: 'test', pocketMoney: 0}
];

function createDoc(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

function cleanDB() {
  log.info('... cleaning the DB');
  var cleanPromises = [User, BankAccount]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
};

function createUsers(data) {

  var promises = users.map(function(user) {
    return createDoc(User, user);
  });

  return Promise.all(promises)
    .then(function(users) {
      return _.merge({users: users}, data || {});
    });
};

function createBankAccounts(data){
  var users = data.users;

  var promises = users.map(function(user, i){
    var account = {
      owner: users[i]._id,
      balance: Math.floor(Math.random()*1000) + 100
    };
    return createDoc(BankAccount, account);
  });

  return Promise.all(promises)
    .then(function(data){
      return Promise.all(users.map(function(user, i){
        return associateBankAccountToUser(data[i], user);
      }))
      .then(function(data){
        return data;
      })
      .catch(function(err){
        return err;
      });
    });
};

function associateBankAccountToUser(account, user){
  user.accounts.push(account);

  return new Promise(function(resolve, reject){
    user.save(function(err, savedUser){
      return err ? reject(err) : resolve(savedUser);
    });
  });
};


cleanDB()
  .then(createUsers)
  .then(createBankAccounts)
  .then(log.info.bind(log))
  .catch(log.error.bind(log));
