/**
 * Test Suite for FifthKeys Platform
 * 
 * This file contains tests for the core functionality of the FifthKeys platform.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../backend/server');
const mongoose = require('mongoose');
const { User } = require('../database/schema');
const { hashPassword } = require('../backend/middleware/security');

chai.use(chaiHttp);

// Test data
const testUser = {
  email: 'test@fifthkeys.com',
  password: 'Test@123456',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin',
  hotelId: 'test-hotel'
};

let authToken;

describe('FifthKeys Platform Tests', function() {
  // Increase timeout for tests
  this.timeout(10000);
  
  // Before all tests, connect to database and create test user
  before(async function() {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fifthkeys-test');
    
    // Clear test data
    await User.deleteMany({});
    
    // Create test user
    const hashedPassword = await hashPassword(testUser.password);
    await User.create({
      ...testUser,
      password: hashedPassword,
      isActive: true,
      lastLogin: new Date()
    });
  });
  
  // After all tests, disconnect from database
  after(async function() {
    await mongoose.connection.close();
  });
  
  // Authentication tests
  describe('Authentication', function() {
    it('should login with valid credentials', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email', testUser.email);
          
          // Save token for later tests
          authToken = res.body.token;
          
          done();
        });
    });
    
    it('should not login with invalid credentials', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .end(function(err, res) {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    
    it('should get user profile with valid token', function(done) {
      chai.request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('email', testUser.email);
          done();
        });
    });
    
    it('should not access protected route without token', function(done) {
      chai.request(app)
        .get('/api/auth/profile')
        .end(function(err, res) {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  
  // RevenuePulse module tests
  describe('RevenuePulse Module', function() {
    it('should get revenue trends data', function(done) {
      chai.request(app)
        .get('/api/revenue-pulse/trends')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId, timeRange: 'month' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    
    it('should get pricing recommendations', function(done) {
      chai.request(app)
        .get('/api/revenue-pulse/pricing')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
  
  // GuestDNA module tests
  describe('GuestDNA Module', function() {
    it('should search for guests', function(done) {
      chai.request(app)
        .get('/api/guest-dna/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    
    it('should get guest sentiment data', function(done) {
      chai.request(app)
        .get('/api/guest-dna/sentiment')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId, timeRange: 'month' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
  
  // HotelTwin module tests
  describe('HotelTwin Module', function() {
    it('should get space utilization data', function(done) {
      chai.request(app)
        .get('/api/hotel-twin/space-utilization')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId, timeRange: 'day' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    
    it('should get energy usage data', function(done) {
      chai.request(app)
        .get('/api/hotel-twin/energy-usage')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ hotelId: testUser.hotelId, timeRange: 'day' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
  
  // Security tests
  describe('Security Features', function() {
    it('should enforce rate limiting', function(done) {
      // Make multiple requests in quick succession
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          chai.request(app)
            .post('/api/auth/login')
            .send({
              email: 'nonexistent@example.com',
              password: 'wrongpassword'
            })
        );
      }
      
      // Execute requests in parallel
      Promise.all(requests)
        .then(responses => {
          // Check if any response has rate limiting headers
          const hasRateLimitHeaders = responses.some(res => 
            res.headers['x-ratelimit-limit'] || 
            res.headers['x-ratelimit-remaining'] || 
            res.headers['retry-after']
          );
          
          expect(hasRateLimitHeaders).to.be.true;
          done();
        })
        .catch(done);
    });
    
    it('should have security headers', function(done) {
      chai.request(app)
        .get('/health')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          
          // Check for security headers
          expect(res.headers).to.have.property('x-content-type-options', 'nosniff');
          expect(res.headers).to.have.property('x-xss-protection');
          expect(res.headers).to.have.property('x-frame-options');
          
          done();
        });
    });
  });
});
