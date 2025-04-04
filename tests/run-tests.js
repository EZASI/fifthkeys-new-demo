/**
 * Test Runner for FifthKeys Platform
 * 
 * This file sets up and runs the test suite for the FifthKeys platform.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create test directory if it doesn't exist
const testDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/fifthkeys-test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = 3001;

console.log('Starting FifthKeys platform tests...');
console.log('Test environment: ', process.env.NODE_ENV);
console.log('Database: ', process.env.MONGODB_URI);

// Run tests with Mocha
const testCommand = 'npx mocha tests/platform.test.js --reporter spec --exit';

exec(testCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Test execution error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Test stderr: ${stderr}`);
  }
  
  console.log(`Test results:\n${stdout}`);
  
  // Save test results to file
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const resultFile = path.join(testDir, `test-results-${timestamp}.txt`);
  
  fs.writeFileSync(resultFile, stdout);
  console.log(`Test results saved to ${resultFile}`);
});
