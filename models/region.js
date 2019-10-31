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
  crags: [{
    type: String,
  }],
  sectors: [{
    type: String,
  }],
});

regionSchema.methods.getPublicFields = function getPublicFields() {
  return {
    id: this._id,
    name: this.name,
    sectors: this.sectors,
    crags: this.crags,
  };
};

module.exports = mongoose.model('Region', regionSchema);
