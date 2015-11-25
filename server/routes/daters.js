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

router.post('/query/', function(req, res){

       var lat = req.body.latitude;
       var long = req.body.longitude;
       var distance = req.body.distance;
       var male = req.body.male;
       var female = req.body.female;
       var other  = req.body.other;
       var minAge = req.body.minAge;
       var maxAge = req.body.maxAge;
       var favLang  = req.body.favlang;
       var reqVerified = req.body.reqVerified;

       var query = Dater.find({});

       if(distance){

           // MongoDB's geospatial - [long, lat]
           query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

               // meters to miles.
               maxDistance: distance * 1609.34, spherical: true});

       }

       // filter by Gender
       if(male || female || other){
           query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
       }

       // filter by Min Age
       if(minAge){
           query = query.where('age').gte(minAge);
       }

       // filter by Max Age
       if(maxAge){
           query = query.where('age').lte(maxAge);
       }

       // ...include filter for HTML5 Verified Locations
       if(reqVerified){
           query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
       }

       // Execute Query and Return the Query Results
       query.exec(function(err, users){
           if(err)
               res.send(err);
           else
               // If no errors, respond with a JSON of all users that meet the criteria
               res.json(users);
       });
   });

module.exports = router;
