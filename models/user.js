const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  hSecret: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
}, {
  timestamps: true,
});

userSchema.methods.getPublicFields = function getPublicFields() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
