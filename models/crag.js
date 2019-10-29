const mongoose = require('mongoose');

const { Schema } = mongoose;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    index: '2dsphere',
  },
});

const cragSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  location: pointSchema,
  region: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
  },
  routes: [{
    type: String,
  }],
});

module.exports = mongoose.model('Crag', cragSchema);
