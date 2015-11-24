var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var config = require('../../_config');


var User = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  githubProfileID: {
    type: String
  },
  googleProfileID: {
    type: String
  },
  instagramProfileID: {
    type: String
  },
  username: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  location: {
    type: [Number],
  }, // [Long, Lat]
  htmlverified: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});


// hash before saving to database
User.pre('save', function(next) {
  var user = this;

  var now = new Date();
  this.updated_at = now;
  if(!this.created_at) {
      this.created_at = now;
  }

  // only hash if the password is new or modified
  if (!user.isModified('password')) return next();

  // generate salt
  bcrypt.genSalt(config.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with the salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // overwrite the plain-text password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// need to add this for doing near searches or something like that!!!
User.index({location: '2dsphere'});

// verify for plain-text and hashed passwords
User.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('users', User);
