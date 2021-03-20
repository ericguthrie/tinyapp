const helpers = require('./helpers');

const express = require("express");
const app = express();
const PORT = 8080; 

const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const {
  response
} = require("express");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.set("view engine", "ejs");

//Data:

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "sadfsd"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

//Users:

const users = {

};


//Login Routes

// Login Page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.user_id,
  };
  res.render("login", templateVars);
});

//Login submit  handlers
app.post("/login", (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send("Hey BUDDAY! You forgot to input e-mail or password!")
  }
  const user = helpers.emailLookup(email, password, users);
  console.log("ERIC IS THIS USER", user);

  if (user) {
    console.log("ERic is this user?", user)
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send("Please Login");
  }
});

// Logout Route

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls")
})

// Registration Routes

//Registration page
app.get("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/register")
})

//Registration submit  handler
app.post("/register", (req, res) => {
  const {
    email,
    password
  } = req.body;

  //hashed password
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("hashed pword", hashedPassword);

  // If no e-mail or password is entered in Register
  if (email === '' || password === '') {
    return res.status(400).send("Hey BUDDAY! You forgot to input e-mail or password!")
  }

  // If registered give user id random string and passowrd
  const id = helpers.generateRandomString();
  users[id] = {
    id,
    email,
    password: hashedPassword
  }

//
req.session.user_id = id;
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session.user_id
  };
  res.render("register", templateVars) //use same name as file, no /(for res.render) unless redirecting(then / is needed)
})

app.post("/urls/:shortURL/delete", (req, res) => {



  const shortURL = req.params.shortURL
  const user = req.session.user_id
  console.log("is this broken?", shortURL, user, urlDatabase[shortURL])
  if (user) {
    if (req.session.user_id === urlDatabase[shortURL].userID) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    } else {
      res.status(403).send("You are not authourized to delete this")
    }
  } else if (!user) {
    res.redirect('/login');
  }

});

app.get("/urls", (req, res) => {
  const filteredURLS = helpers.urlsforUser(req.session.user_id, urlDatabase);
  console.log("is this right?", req.session.user_id)
  const user = users[req.session.user_id];
  const templateVars = {
    user,
    urls: filteredURLS
  };

  res.render("urls_index", templateVars); //passes ejs directory, then looks for file urls_index
});

app.post("/urls", (req, res) => {
  let key = helpers.generateRandomString();
  let value = req.body.longURL;

  urlDatabase[key] = {
    longURL: value,
    userID: req.session["user_id"]
  }

  console.log("is this broken?", urlDatabase)
  res.redirect('/urls');
});


app.get("/urls/new", (req, res) => {
  const {
    email,
    password,
    id
  } = req.body;
  const templateVars = {
    user: users[req.session.user_id],
  };

  const user = req.session.user_id
console.log("USER USER USER?", user)
  if (user) {
    res.render("urls_new", templateVars);
  } else if (!user) {
    res.redirect('/login');
  }

});



app.post("/urls/:id", (req, res) => {
  const {
    email,
    password
  } = req.body;

  // const urlsBelongsTo = urlDatabase[shortURL] && urlDatabase[shortURL].user_id === user_id;

  // if (urlsBelongsTo) {
  //   urlDatabse[shortURL].longURL = longURL;
  //   return res.redirect("/urls");
  // };
  const templateVars = {
    user: req.session["user_id"],
  };

  const user = req.session.user_id

  if (user) {
    res.redirect("/urls");
  } else if (!user) {
    res.redirect('/login');
  }
  longURL = req.body.longURL;
  shortURL = req.params.id;
  urlDatabase[req.params.id].longURL = longURL;;
})


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: req.session["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

