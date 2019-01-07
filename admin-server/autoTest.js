var supertest = require('supertest');
var app = require('./app');
var reqTest = supertest(app);
var assert = require('chai').assert; 


describe('GET /', function() {
    it('Visit URL', function(done) {
        request.get('/')
            .expect(200)
            .end(done);
    });
});