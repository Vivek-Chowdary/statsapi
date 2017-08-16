//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
var expect = chai.expect;

//Our parent block
describe('Stats api', () => {
    beforeEach((done) => { });
  });

  /*
  * Test the /GET route
  */
  describe('/GET race', () => {
      it('Returns 404 if the race does not exist', (done) => {
        chai.request(server)
            .get('/api/IMSA/2014/LONG_BEACH')
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
      });

      it('Returns 200 if the race exists', (done) => {
        chai.request(server)
            .get('/api/WEC/2017/SPA')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it('Returns the CORS headers', (done) => {
        chai.request(server)
            .get('/api/WEC/2017/SPA')
            .end((err, res) => {
              res.should.have.header("Access-Control-Allow-Origin", "*");
              res.should.have.header("Access-Control-Allow-Headers", "X-Requested-With");
              done();
            });
      });

  });
