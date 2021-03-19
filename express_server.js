const express = require("express");
const app = express();
const PORT = 8080; // default port 8080;
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
const {
  response
} = require("express");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

//Functions:

function generateRandomString(length = 6) {
  return Math.random().toString(16).substr(2, length);
};

function emailLookup(email, password) {
  let user = null;
  for (let userid in users) {
    if (users[userid].email === email && users[userid].password === password) {
      user = users[userid];
      break;
    }
  }
  return user
}

function idLookup(email) {
  for (let key in users) {
    if (users[key], email === email) {
      return users[key].id
    }
  }
};

function urlsforUser(userID) {
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
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "1234"
  // },
  // "user2RandomID": {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk"
  // }
};


//Login Routes

// Login Page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies.user_id,
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
  const user = emailLookup(email, password);
  console.log(user);

  if (user) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Please Login");
    // return res.redirect('/login')
  }
});


// Logout Route

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
})

// Registration Routes

//Registration page
app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/register")
})

//Registration submit  handler
app.post("/register", (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send("Hey BUDDAY! You forgot to input e-mail or password!")
  }



  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password
  }

  res.cookie("user_id", id);
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"]
  };
  res.render("register", templateVars) //use same name as file, no /(for res.render) unless redirecting(then / is needed)
})

app.post("/urls/:shortURL/delete", (req, res) => {

 

  const shortURL = req.params.shortURL
  const user = req.cookies['user_id']
  console.log("is this broken?", shortURL, user)
  if (user) {
   if(req.cookies['user_id'] === urlDatabase[shortURL].userID) {
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
  const filteredURLS = urlsforUser(req.cookies.user_id);
  console.log("is this right?", req.cookies.user_id)
  const user = users[req.cookies.user_id];
  const templateVars = {
    user,
    urls: filteredURLS
  };

  res.render("urls_index", templateVars); //passes ejs directory, then looks for file urls_index
});

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  let value = req.body.longURL;

  urlDatabase[key] = { longURL: value,
  userID:  req.cookies["user_id"]}

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
    user: req.cookies["user_id"],
  };

  const user = req.cookies['user_id']

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
    user: req.cookies["user_id"],
  };

  const user = req.cookies['user_id'];

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
    user: req.cookies["user_id"],
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

// for (let key in users) {
//   if (users[key].email === email) {
//     return res.status(400).send("Hey BUDDAY! This e-mail isn't allowed!")
//   }
//   else if(users[key].email === null) {
//     return res.status(403).send("Hey BUDDAY! This e-mail cannot be found!")
//   }
//   else if(users[key].email && users[key].email === password) {
//     res.cookie("user_id");
//   } else {
//     res.redirect("/urls");
//   }
// }

// const id = generateRandomString();
// users[id] = {
//   id,
//   email,
//   password
// }