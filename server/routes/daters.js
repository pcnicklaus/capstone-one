var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'));
// var mongoose = require('mongoose');
var Dater = require('../models/daters.js');


router.get('/', function(req, res, next){
  Dater.findQ()
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error);
    })
    .done();
});


router.post('/', function(req, res, next) {
    var newDater = new Dater({
      username: req.body.username,
      gender: req.body.gender,
      age: req.body.age,
      location: req.body.location
    });
    newDater.saveQ()
    .then(function(result) {
        console.log(result);
        res.json(result);
    })
    .catch(function(err) {
        res.json(err);
    })
    .done();
});

router.get('/:id', function(req, res, next){
  Dater.findByIdQ(req.params.id)
    .then(function (result) {
      console.log(result);
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error);
    })
    .done();
});


router.put('/:id', function (req, res, next) {
  var update = req.body;
  Dater.findByIdAndUpdateQ(req.params.id, update)
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
  Dater.findByIdAndRemoveQ(req.params.id)
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
