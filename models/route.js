const mongoose = require('mongoose');

const { Schema } = mongoose;

const routeSchema = new Schema({
  name: {
    type: String,
    require: true,
    index: true,
  },
  grade: String,
  protection: String,
  author: String,
  year: String,
  length: String,
  crag: String,
  ascents: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Route', routeSchema);
