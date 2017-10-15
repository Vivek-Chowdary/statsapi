//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let sec = require("../app/seconds.js");
let stat = require("../app/statscalculation.js");

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

      it('Included IMSA 2017 VIRGINIA', (done) => {
        chai.request(server)
            .get('/api/IMSA/2017/VIRGINIA')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it('Included IMSA 2017 LAGUNA_SECA', (done) => {
        chai.request(server)
            .get('/api/IMSA/2017/LAGUNA_SECA')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it('Included WEC 2017 MEXICO', (done) => {
        chai.request(server)
            .get('/api/WEC/2017/MEXICO')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it('Included WEC 2017 AUSTIN', (done) => {
        chai.request(server)
            .get('/api/WEC/2017/AUSTIN')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

      it('Included IMSA 2017 ROAD_ATLANTA', (done) => {
        chai.request(server)
            .get('/api/IMSA/2017/ROAD_ATLANTA')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });
      it('Included WEC 2017 FUJI', (done) => {
        chai.request(server)
            .get('/api/WEC/2017/FUJI')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });
  });

  describe('/GET getevents', () => {

      it('Returns 200', (done) => {
        chai.request(server)
            .get('/api/getevents')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });

    });

  describe("Seconds Function", () => {

    it('Manages times with hours', (done) => {
      sec.toSeconds("1:30:45.678").should.equal(5445.678);
      done();
    });

    it('Manages times without hours', (done) => {
      sec.toSeconds("1:45.678").should.be.equal(105.678);
      done();
    });

    it('Manages times without minutes', (done) => {
      sec.toSeconds("45.678").should.be.equal(45.678);
      done();
    });

  });

  describe("Stats calculate", () => {

    it('Returns the data with 3 decimals', (done) => {
       data = [{
        class: 'Test',
        manufacturer: 'TestMaufacturer',
        team: 'TestTeam',
        driver_name: 'TestDriver',
        segundos: '45.677999999'
      }];

      stat.calcStats(data)[0].min.should.equal('45.678');
      stat.calcStats(data)[0].avg.should.equal('45.678');
      stat.calcStats(data)[0].top20.should.equal('45.678');

      done();
    });

  });
