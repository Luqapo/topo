const mongoose = require('mongoose');

const { Schema } = mongoose;

const cragSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  region: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Crag', cragSchema);
