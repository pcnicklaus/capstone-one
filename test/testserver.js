process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-Http');
var mongoose = require('mongoose');

var server = require('../server/app');
var Dater = require('../server/models/daters');

var should = chai.should();
chai.use(chaiHttp);

describe('Daters', function() {

  Dater.collection.drop();

  beforeEach(function(done){
    var newDater = new Dater({
      email: 'test@test.com',
      password: '123',
      username: 'HonkeyMagoo',
      gender: 'female',
      age: 33,
      location: [11.11, 22.22]
    });
    newDater.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
    Dater.collection.drop();
    done();
  });

it('should list ALL Daters on /daters GET', function(done) {
  chai.request(server)
    .get('/daters')
    .end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('username');
      res.body[0].should.have.property('gender');
      res.body[0].username.should.equal('HonkeyMagoo');
      res.body[0].gender.should.equal('female');
      res.body[0].age.should.equal(33);
      done();
    });
  });

  it('should list a SINGLE user on /daters/<id> GET', function(done) {
    var newDater = new Dater ({
      username: 'HonkeyMagoo',
      gender: 'female',
      age: 33,
      location: [11.11, 22.22]
    });
    newDater.save(function (err, data) {
      chai.request(server)
        .get('/daters/' + data.id)
        .end(function (err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('gender');
          res.body.gender.should.equal('female');
          done();
        });
    });
  });

  it('should add a SINGLE user on /daters POST', function(done) {
    chai.request(server)
      .post('/daters')
      .send({
        'username': 'ScrappyMagoo',
        'gender': 'female',
        'age': 3
      })
      .end( function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        // res.body.should.have.property('SUCCESS');
        // res.body.SUCCESS.should.be.a('object');
        // res.body.SUCCESS.should.have.property('name');
        // res.body.SUCCESS.should.have.property('description');
        // res.body.SUCCESS.should.have.property('tags');
        // res.body.SUCCESS.should.have.property('_id');
        // res.body.SUCCESS.name.should.equal('Java');
        // res.body.SUCCESS.description.should.equal('Script');
        done();
      });
  });

  // it('should update a SINGLE Exercise on /api/exercise/<id> PUT', function(done) {
  //   chai.request(server)
  //     .get('/api/exercises')
  //     .end(function (err, res) {
  //       chai.request(server)
  //         .put('/api/exercise/' + res.body[0]._id)
  //         .send({'name': 'HonkeyMagoo'})
  //         .end( function (err, res) {
  //           res.should.have.status(200);
  //           res.should.be.json;
  //           res.body.should.be.a('object');
  //           res.body.should.have.property('UPDATED');
  //           res.body.UPDATED.should.be.a('object');
  //           res.body.UPDATED.should.have.property('name');
  //           res.body.UPDATED.should.have.property('_id');
  //           res.body.UPDATED.name.should.equal('HonkeyMagoo');
  //           done();
  //         });
  //     });
  // });

  // it('should delete a SINGLE exercise on /api/exercise/<id> DELETE', function(done) {
  //   chai.request(server)
  //     .get('/api/exercises')
  //     .end(function (err, res) {
  //       chai.request(server)
  //         .delete('/api/exercise/' + res.body[0]._id)
  //         .end( function (err, res) {
  //           res.should.have.status(200);
  //           res.should.be.json;
  //           res.body.should.be.a('object');
  //           res.body.should.have.property('DELETED');
  //           res.body.DELETED.should.be.a('object');
  //           res.body.DELETED.should.have.property('name');
  //           res.body.DELETED.should.have.property('description');
  //           res.body.DELETED.should.have.property('_id');
  //           res.body.DELETED.name.should.equal('Something');
  //           res.body.DELETED.description.should.equal('A description');
  //           done();
  //         });
  //     });

  // });

});
