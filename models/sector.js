const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectorSchema = new Schema({
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
  crags: [{
    type: String,
  }],
});

module.exports = mongoose.model('Sector', sectorSchema);
