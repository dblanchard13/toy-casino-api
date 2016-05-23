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

  it('should get all <%= name %>s', function(done){
    request(app)
      .get('/api/<%= name %>s')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, resp){

        done();
      });
  });

  it('should create a <%= name %>', function(done){
    var <%= name %> = {
      prop1: 'property 1',
      prop2: 'property 2'
    };

    request(app)
      .post('/api/<%= name %>s')
      .send(<%= name %>)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, resp){
        expect(resp.body).to.be.an('object');
        done();
      });
  });

  it('should delete a <%= name %>', function(done){
    var <%= name %> = {
      prop1: 'property 1',
      prop2: 'property 2'
    };

    request(app)
      .post('/api/<%= name %>s')
      .send(<%= name %>)
      .set('Accept', 'application/json')
      .end(function(err, resp){
        var id = resp.body._id;
        request(app)
          .delete('/api/<%= name %>s/' + id)
          .end(function(err, resp){
            resp.text = JSON.parse(resp.text);
            expect(resp.text.prop1).to.eql(<%= name %>.prop1);
            done();
          });
      });
  });

  it('should update a <%= name %>', function(done){
    var <%= name %> = {
      prop1: 'property 1',
      prop2: 'property 2'
    };

    request(app)
      .post('/api/<%= name %>s')
      .send(<%= name %>)
      .set('Accept', 'application/json')
      .end(function(err, resp){
        var saved = resp.body;

        request(app)
          .put('/api/<%= name %>s/' + saved._id)
          .send({
            prop1: 'new property'
          })
          .end(function(err, resp){
            expect(resp.body.prop1).to.equal('new property');
            done();
          });
      });
  });
});


