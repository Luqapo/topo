const mongoose = require('mongoose');
const Sector = require('../models/sector');
const Crag = require('../models/crag');

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

async function getSectorId(name) {
  const sector = await Sector.findOne({ name });
  return { id: sector._id, name };
}

async function getCragId(name) {
  const crag = await Crag.findOne({ name });
  return { id: crag._id, name, location: crag.location };
}

regionSchema.methods.getPublicFields = async function getPublicFields() {
  const sectorsPromises = this.sectors.map((s) => getSectorId(s));
  const cragsPromises = this.crags.map((c) => getCragId(c));
  const sectors = await Promise.all(sectorsPromises);
  const crags = await Promise.all(cragsPromises);
  const obj = {
    id: this._id,
    name: this.name,
    sectors,
    crags,
  };
  return obj;
};

module.exports = mongoose.model('Region', regionSchema);
