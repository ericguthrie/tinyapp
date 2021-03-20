const bcrypt = require('bcrypt');

const generateRandomString = function (length = 6) {
  return Math.random().toString(16).substr(2, length);
};

const emailLookup = function (email, password, users) {
  let user = null;

  for (let userid in users) {
    if (users[userid].email === email && bcrypt.compareSync(password, users[userid].password)) {
      user = users[userid];
      break;

    } else if (users[userid].email === email && password === users[userid].password) {
      user = users[userid];
      break;
    }
  }
  return user
}

const urlsforUser = function (userID, urlDatabase) {
  const output = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      output[shortURL] = {
        longURL: urlDatabase[shortURL].longURL
      }
    }
  }
  return output;
};


module.exports = {
  emailLookup,
  urlsforUser,
  generateRandomString,
}