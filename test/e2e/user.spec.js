const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');
const User = require('../../models/user');

let app;

describe('User endpoints', () => {
  before(async () => {
    app = await appInit();
    await User.deleteMany({});
  });
  describe('POST /user', () => {
    it('creates new user', async () => {
      const userData = {
        email: 'api-user-test1@test.com',
        name: 'Bolek',
        password: 'testPassword',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('email');
      expect(res.body).to.have.property('createdAt');
      expect(res.body.id).to.be.a('string');
      expect(res.body.email).to.equal(userData.email);
      const userFromDb = await User.findOne({ _id: res.body.id });
      expect(userFromDb.email).to.equal(res.body.email);
      expect(res.body.token).to.be.an('string');
      const checkUser = res.body;
      const { token } = res.body;
      const res1 = await request(app.callback())
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      delete checkUser.token;
      expect(res1.body).to.deep.equal(checkUser);
    });
    it('throws error (Account whit this email already exist)', async () => {
      const userData = {
        email: 'api-user-test1@test.com',
        name: 'Edek',
        password: 'testPassword',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(401);
      expect(res.body.error).to.equal('Account with this email already exist');
    });
    it('throws error Passwor required when password is missing', async () => {
      const userData = {
        email: 'api-user-test2@test.com',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(400);
      expect(res.body.error).to.equal('Password required, minimal length 6 characters');
    });
    it('throws error Passwor required when password is to short', async () => {
      const userData = {
        email: 'api-user-test3@test.com',
        password: 'test',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(400);
      expect(res.body.error).to.equal('Password required, minimal length 6 characters');
    });
    it('throws error (Email required) when email is missing', async () => {
      const userData = {
        name: 'Xmen',
        password: 'testPassword',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(422);
      expect(res.body.error).to.equal('Please add a email');
    });
  });
  describe('POST /user/login', () => {
    it('returns 200 and token', async () => {
      const userData = {
        email: 'api-user-test11@test.com',
        name: 'Xmen2',
        password: 'testPassword',
      };
      const res = await request(app.callback())
        .post('/user')
        .send(userData)
        .expect(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('email');
      expect(res.body).to.have.property('createdAt');
      expect(res.body.id).to.be.a('string');
      expect(res.body.email).to.equal(userData.email);
      const userFromDb = await User.findOne({ _id: res.body.id });
      expect(userFromDb.email).to.equal(res.body.email);
      expect(res.body.token).to.be.an('string');
      const res1 = await request(app.callback())
        .post('/user/login')
        .send(userData)
        .expect(200);
      expect(res1.body.email).to.equal(userData.email);
      expect(res1.body.token).to.be.an('string');
      expect(res1.body.password).to.equal(undefined);
    });
    it('returns 404 and error (User not found) when try to login with wrong email', async () => {
      const userData = {
        email: 'api-user-test10@test.com',
        password: 'testPassword',
      };
      const res = await request(app.callback())
        .post('/user/login')
        .send(userData)
        .expect(404);
      expect(res.body.error).to.equal('User not found');
    });
    it('returns 404 and error (User not found) when try to login with wrong passwor', async () => {
      const userData = {
        email: 'api-user-test11@test.com',
        password: 'wrongPass',
      };
      const res = await request(app.callback())
        .post('/user/login')
        .send(userData)
        .expect(401);
      expect(res.body.error).to.equal('Wrong password');
    });
  });
});
