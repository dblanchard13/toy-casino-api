var j = require('j.require');
var app = j.require('server/server');
var request = require('supertest');
var expect = require('chai').expect;
var log = require('db.log');

describe('[USERS]', function(){

  beforeEach(function(done){
    require('../../util/seed');
    setTimeout(function(){done()}, 1500);
  })

  it('should get all users and they should have their bank accounts associated with them', function(done) {
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('array');
        expect(resp.body.length).to.equal(3);
        var user = resp.body[0];
        expect(user.accounts).to.not.be.undefined;
        done();
      });
  });

  it('should create a user and also create an associated bank account', function(done) {
    var user = {
      username: 'Jesus H',
      password: 'chillin',
      pocketMoney: '13'
    };

    request(app)
      .post('/api/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('object');
        var token = 'Bearer ' + resp.body['token'];
        var authConfig = {'Authorization': token};

        request(app)
          .get('/api/users/me')
          .set(authConfig)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, resp) {
            resp.text = JSON.parse(resp.text);
            expect(resp.text.username).to.eql(user.username);
            expect(resp.text.accounts).to.not.be.undefined;
            done();
        });
      });
  });

  it('should delete a user', function(done) {
    var user = {
      username: 'Jimmy H',
      password:'christ',
      pocketMoney: 13
    };

    request(app)
      .post('/api/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(err, resp) {
        var token = 'Bearer ' + resp.body['token'];
        var authConfig = {'Authorization': token};

        request(app)
          .get('/api/users/me')
          .set(authConfig)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, resp) {
            resp.text = JSON.parse(resp.text);
            expect(resp.text.username).to.eql(user.username);

            request(app)
              .delete('/api/users/' + resp.text._id)
              .set(authConfig)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, resp){
                request(app)
                  .get('/api/users/me')
                  .set(authConfig)
                  .set('Accept', 'application/json')
                  .expect(401)
                  .end(function(err, resp){
                    // By this last request having a status code for unauthorized 
                    // it confirms that the user created earlier no longer exists
                    done();
                  });
              });
          });
      });
  });

  it('should update a user', function(done) {
    var user = {
      username: 'some crazy username',
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
          .get('/api/users/me')
          .set(authConfig)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, resp) {
            resp.text = JSON.parse(resp.text);
            expect(resp.text.username).to.eql(user.username);

            request(app)
              .put('/api/users/' + resp.text._id)
              .set(authConfig)
              .send({ username: 'new name' })
              .end(function(err, resp) {
                expect(resp.body.username).to.equal('new name');
                done();
              });
          });
      });
  });
});


