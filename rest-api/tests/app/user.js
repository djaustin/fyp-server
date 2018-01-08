process.env.NODE_ENV = 'test';

const User = require('app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index.js');

const should = chai.should();

chai.use(chaiHttp);
describe('Users', () => {

  /**
   * INTEGRATION
   */
  let testUsers = [];
  beforeEach('Flush users and add test users', async function(){
    await User.remove({});
    testUsers = [];
    for (var i = 0; i < 2; i++) {
      const user = new User({
        firstName: `test${i}FirstName`,
        lastName: `test${i}LastName`,
        email: `test${i}@mail.com`,
        password: `password`
      });
      await user.save();
      testUsers.push(user);
    }

  });

  describe('GET /api/users/:userId', function (){

    it('should get the user details of the specified user', async () => {
      const res = await chai.request(server).get('/api/users/' + testUsers[0]._id).auth(testUsers[0].email, 'password');
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.an('object');
      res.body.should.have.property('status').which.equals('success');
      res.body.should.have.property('data').which.is.an('object');
      res.body.data.should.have.property('user').which.is.an('object');
      res.body.data.user.should.have.property('_id');
      res.body.data.user.should.have.property('email');
      res.body.data.user.should.have.property('firstName');
      res.body.data.user.should.have.property('lastName');
    });

    it('should not get the user if not authenticated', async function(){
      try{
        const res = await chai.request(server).get('/api/users/' + testUsers[0]._id);
        throw new Error("Expected error 401");
      } catch(err){
        err.response.should.have.status(401);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
        err.response.body.data.should.have.property('authentication').which.is.a('string');
      }
    });

    it('should not get the user if authenticated as a different user', async function(){
      try{
        const res = await chai.request(server).get('/api/users/' + testUsers[1]._id).auth(testUsers[0].email, 'password');
        throw new Error("Expected error 403");
      } catch(err){
        err.response.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
        err.response.body.data.should.have.property('authorisation').which.is.a('string');
      }
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete the specified user', async () => {
      let users = await User.find({_id: testUsers[0]._id});
      users.should.be.an('array');
      users.should.have.lengthOf(1);
      await chai.request(server).delete('/api/users/' + testUsers[0]._id).auth(testUsers[0].email, 'password');
      users = await User.find({_id: testUsers[0]._id});
      users.should.be.an('array');
      users.should.have.lengthOf(0);
    });

    it('should not delete the user if not authenticated', async () => {
      try{
        await chai.request(server).delete('/api/users/' + testUsers[0]._id);
        throw new Error("Expected error 403");
      } catch(err){
        err.response.should.have.status(401);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
        err.response.body.data.should.have.property('authentication').which.is.a('string');
      }
    });

    it('should not delete the user if authenticated as a different user', async () => {
      try{
        await chai.request(server).delete('/api/users/' + testUsers[1]._id).auth(testUsers[0].email, 'password');
        throw new Error("Expected error 403");
      } catch(err){
        err.response.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.be.an('object');
        err.response.body.should.have.property('status').which.equals('fail');
        err.response.body.should.have.property('data').which.is.an('object');
        err.response.body.data.should.have.property('authorisation').which.is.a('string');
      }
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update the details of the specified user', async () => {
      const userBeforeUpdate = await User.findOne({_id: testUsers[0]._id});
      let expectedEmailAfterUpdate = 'prefix' + userBeforeUpdate.email
      await chai.request(server).patch('/api/users/' + testUsers[0]._id).send({email: expectedEmailAfterUpdate}).auth(testUsers[0].email, 'password');
      const userAfterUpdate = await User.findOne({_id: testUsers[0]._id});
      userAfterUpdate.should.be.an('object');
      userAfterUpdate.should.have.property('email').which.equals(expectedEmailAfterUpdate);
      userAfterUpdate.should.have.property('firstName').which.equals(userBeforeUpdate.firstName);
      userAfterUpdate.should.have.property('lastName').which.equals(userBeforeUpdate.lastName);
    });
  //
  //   it('should not delete the user if not authenticated', async () => {
  //     try{
  //       await chai.request(server).delete('/api/users/' + testUsers[0]._id);
  //       throw new Error("Expected error 403");
  //     } catch(err){
  //       err.response.should.have.status(401);
  //       err.response.should.be.json;
  //       err.response.body.should.be.an('object');
  //       err.response.body.should.have.property('status').which.equals('fail');
  //       err.response.body.should.have.property('data').which.is.an('object');
  //       err.response.body.data.should.have.property('authentication').which.is.a('string');
  //     }
  //   });
  //
  //   it('should not delete the user if authenticated as a different user', async () => {
  //     try{
  //       await chai.request(server).delete('/api/users/' + testUsers[1]._id).auth(testUsers[0].email, 'password');
  //       throw new Error("Expected error 403");
  //     } catch(err){
  //       err.response.should.have.status(403);
  //       err.response.should.be.json;
  //       err.response.body.should.be.an('object');
  //       err.response.body.should.have.property('status').which.equals('fail');
  //       err.response.body.should.have.property('data').which.is.an('object');
  //       err.response.body.data.should.have.property('authorisation').which.is.a('string');
  //     }
  //   });
  });

  describe('POST /api/users', () => {

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
        throw new Error("Expected error 400");
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
        throw new Error("Expected error 400");
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
