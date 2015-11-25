var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Dater = new Schema({
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

Dater.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
Dater.index({location: '2dsphere'});


module.exports = mongoose.model('daters', Dater);
