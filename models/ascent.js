const mongoose = require('mongoose');

const { Schema } = mongoose;

const ascentSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  crag: {
    type: Schema.Types.ObjectId,
    ref: 'Crag',
  },
  style: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
  },
  grade: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

module.exports = mongoose.model('Ascent', ascentSchema);
