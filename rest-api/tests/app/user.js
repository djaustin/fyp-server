process.env.NODE_ENV = 'test';

const User = require('app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index.js');

const should = chai.should();

chai.use(chaiHttp);
describe('Users', () => {

  before('Flush users and add test user', async () => {
    await User.remove({});
    const testUser = new User({
      firstName: 'testFirstName',
      lastName: 'testLastName',
      email: 'test@mail.com',
      password: 'password'
    });
    await testUser.save();
  });

  describe('/GET users', () => {
    it('should get all the users', async () => {
        const res = await chai.request(server).get('/api/users').auth('test@mail.com', 'password');
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.should.have.property('status').which.equals('success');
        res.body.should.have.property('data').which.is.an('object');
        res.body.data.should.have.property('users').which.is.an('array');
        res.body.data.users.length.should.equal(1);
    });
  });

  describe('/POST users', () => {

    it('should should allow a post with correct details', async () => {
      let requestData = {
        firstName: 'userFirstName',
        lastName: 'userLastName',
        password: 'password',
        email: 'user@mail.com'
      }
      const res = await chai.request(server).post('/api/users').send(requestData);
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('status').which.equals('success');
      res.body.should.have.property('data').which.is.an('object');
      res.body.data.should.have.property('user').which.is.an('object');
      res.body.data.user.should.have.property('_id');
      res.body.data.should.have.property('locations').which.is.an('array');
      res.body.data.locations.should.have.lengthOf.above(0);
    });

    it('should not POST a user without an email', async () => {
      let requestData = {
        firstName: 'userFirstName',
        lastName: 'userLastName',
        password: 'password'
      }
      try{
        const res = await chai.request(server).post('/api/users').send(requestData);
        return new Error("Expected error 400");
      } catch (err){
        err.response.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
      }
    });

    it('should not POST a user without a password', async () => {
      let requestData = {
        firstName: 'userFirstName',
        lastName: 'userLastName',
        email: 'user@mail.com'
      }
      try{
        const res = await chai.request(server).post('/api/users').send(requestData);
        return new Error("Expected error 400");
      } catch (err){
        err.response.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
      }
    });
  });
});
