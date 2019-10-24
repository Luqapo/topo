const mongoose = require('mongoose');

const { Schema } = mongoose;

const regionSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  area: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Region', regionSchema);
