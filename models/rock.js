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

const rockSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  location: pointSchema,
  crag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Rock', rockSchema);
