var j = require('j.require');
var app = j.require('server/server');
var request = require('supertest');
var expect = require('chai').expect;
var log = require('db.log');

describe('[BANK ACCOUNTS]', function(){

  beforeEach(function(done){
    // need to refactor the seeder to return a promise and not rely on a timeout
    j.require('server/util/seed');
    setTimeout(function(){done()}, 1500);
  });

  it('should get all bank accounts and they should have their owners associated with them', function(done) {
    request(app)
      .get('/api/bank')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('array');
        expect(resp.body.length).to.equal(3);
        var bankAccount = resp.body[0];
        expect(bankAccount.owner).to.not.be.undefined;
        done();
      });
  });

  it('should delete a bank account', function(done) {
    var user = {
      username: 'bank account deleter',
      password: '100',
      pocketMoney: 13
    };

    request(app)
      .post('/api/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, resp) {
        var token = 'Bearer ' + resp.body['token'];
        var authConfig = {'Authorization': token};

        request(app)
          .get('/api/bank')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, resp) {
            expect(resp.body).to.be.an('array');
            expect(resp.body.length).to.equal(4);
            var bankAccount = resp.body[0];

            request(app)
              .delete('/api/bank/' + bankAccount._id)
              .set(authConfig)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, resp){

                request(app)
                  .get('/api/bank')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, resp){
                    expect(resp.body).to.be.an('array');
                    expect(resp.body.length).to.equal(3);
                    done();
                  });
              });
          });
      });
  });

  it('should update a bank account balance and move the withdrawn money into the attached user\'s pocketMoney', function(done){
    var user = {
      username: 'bank account updater',
      password: '100',
      pocketMoney: 13
    };

    request(app)
      .post('/api/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(err, resp) {
        var token = 'Bearer ' + resp.body['token'];
        var authConfig = {'Authorization': token};
        var bankAccount = resp.body['user']['accounts'][0];
        var savedUser = resp.body['user'];

        expect(savedUser.username).to.equal(user.username);
        expect(savedUser.pocketMoney).to.equal(user.pocketMoney);

        request(app)
          .put('/api/bank/' + bankAccount._id)
          .set(authConfig)
          .set('Accept', 'application/json')
          .send({ 
            amount: 13,
            userId: savedUser._id
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, resp){
            resp.text = JSON.parse(resp.text);
            expect(resp.text.pocketMoney).to.equal(26);

            request(app)
              .get('/api/bank/' + bankAccount._id)
              .set('Accept', 'application/json')
              .end(function(err, resp){
                resp.text = JSON.parse(resp.text);
                expect(resp.text.balance).to.equal(bankAccount.balance - 13);
                done();
              });
          });
      });
  });

});
