const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
/* istanbul ignore next */
const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];
const { ConflictError, RequestError, NotFoundError } = require('../utils/error');

async function createUser(u) {
  if(!u.password || u.password.length < 6) {
    throw new RequestError('Password required, minimal length 6 characters');
  }
  const user = await User.findOne({ email: u.email });
  if(user) {
    throw new ConflictError('Account with this email already exist');
  }
  const hashedPAssword = bcrypt.hashSync(u.password, 8);
  const newUser = await User.create({
    email: u.email,
    name: u.name,
    hSecret: hashedPAssword,
    ...(u.role === 'publisher' && { role: 'publisher' }),
  });
  const token = jwt.sign({ userId: newUser._id }, config.secret, { expiresIn: '1h' });
  return { token, ...newUser.getPublicFields() };
}

async function getUser(id) {
  const user = await User.findById(id);
  return user;
}

async function login(u) {
  const user = await User.findOne({ email: u.email });
  if(!user) {
    throw new NotFoundError('User not found');
  }
  const passwordIsValid = bcrypt.compareSync(u.password, user.hSecret);
  if(!passwordIsValid) {
    throw new ConflictError('Wrong password');
  }
  const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1h' });
  return { token, ...user.getPublicFields() };
}

Object.assign(module.exports, {
  create: createUser,
  get: getUser,
  login,
});
