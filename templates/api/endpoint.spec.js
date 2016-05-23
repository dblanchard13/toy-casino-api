var j.require = require('j.require');
var app = j.require('server/server');
var request = require('supertest');
var expect = require('chai').expect;
var log = require('db.log');

describe('[<%= upCaseName %>]', function(){

  beforeEach(function(done){
    require('../../util/seed');
    setTimeout(function(){done()}, 1500);
  })

  it('should get all <%= name %>s', function(done) {
    request(app)
      .get('/api/<%= name %>s')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('array');
        expect(resp.body.length).to.equal(3);
        done();
      })
  });

  it('should create a <%= name %>', function(done) {
    request(app)
      .post('/api/<%= name %>s')
      .send({
        prop1: 'property 1',
        prop2: 'propert 2'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('object');
        done();
      })
  });

  it('should delete a <%= name %>', function(done) {
    var <%= name %> = {
      prop1: 'property 1',
      prop2: 'property 2'
    };
    request(app)
      .post('/api/<%= name %>s')
      .send(<%= name %>)
      .set('Accept', 'application/json')
      .end(function(err, resp) {
        var id = resp.body._id;
        request(app)
          .delete('/api/<%= name %>s/' + id)
          .end(function(err, resp) {
            resp.text = JSON.parse(resp.text);
            log.info('RESPONSE: ', resp);
            expect(resp.text.prop1).to.eql(<%= name %>.prop1);
            done();
          });
      })
  });

  it('should update a lion', function(done) {
    request(app)
      .post('/api/<%= name %>s')
      .send({
        <%= name %>name: 'testing lion',
        password: '100'
      })
      .set('Accept', 'application/json')
      .end(function(err, resp) {
        var lion = resp.body;
        request(app)
          .put('/api/<%= name %>s/' + lion.id)
          .send({
            <%= name %>name: 'new name'
          })
          .end(function(err, resp) {
            expect(resp.body.<%= name %>name).to.equal('new name');
            done();
          });
      })
  });
});


