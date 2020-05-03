const mongoose = require('mongoose');
const Crag = require('../models/crag');

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

async function getCragId(name) {
  const crag = await Crag.findOne({ name });
  return { id: crag._id, name, location: crag.location };
}

sectorSchema.methods.getPublicFields = async function getPublicFields() {
  const cragsPromises = this.crags.map((c) => getCragId(c));
  const crags = await Promise.all(cragsPromises);
  return {
    id: this._id,
    name: this.name,
    region: this.region,
    crags,
  }
}

module.exports = mongoose.model('Sector', sectorSchema);
