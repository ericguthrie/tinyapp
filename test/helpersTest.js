const { assert } = require('chai');

const { emailLookup } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", "purple-monkey-dinosaur", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput, 'same user names from e-mail')
  });
  it('should return undefined for an empty string', function() {
    const user = emailLookup("", "purple-monkey-dinosaur",testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput, 'empty email should return undefined')
  })
  it('should return undefined for an invalid e-mail', function() {
    const user = emailLookup("meowmeow@gmail.com", "purple-monkey-dinosaur", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput, 'empty email should return undefined')
  })
});