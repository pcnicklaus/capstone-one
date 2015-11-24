var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/users.js');


router.get('/', function(req, res, next){
  User.find(function(err, response){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      console.log(response);
      res.send(err);
    }
  });
});


router.post('/', function(req, res, next) {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      gender: req.body.gender,
      age: req.body.age,
      location: req.body.location
    });
    newUser.saveQ()
    .then(function(result) {
        console.log(result);
        res.json(result);
    })
    .catch(function(err) {
        console.log(err);
        res.send(err);
    })
    .done();
});

router.put('/:id', function (req, res, next) {
  var update = req.body;
  User.findByIdAndUpdateQ(req.params.id, update)
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(function (err) {
      console.log(result);
      res.json(result);
    })
    .done();
});

router.delete('/:id', function (req, res, next) {
  User.findByIdAndRemoveQ(req.params.id)
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(function (err) {
      console.log(result);
      res.json(result);
    });
});

module.exports = router;
