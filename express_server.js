const express = require("express");
const app = express();
const PORT = 8080; // default port 8080;
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser")
app.use(cookieParser())

function generateRandomString(length = 6) {
  return Math.random().toString(16).substr(2, length);
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
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




app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  let value = req.body.longURL;
  urlDatabase[key] = value

  res.redirect('/urls');
});



// Profile Page
// app.get('/profile', (req, res) => {
//   if (users[req.cookies.user]) {
//     const templateVars = { users: users }
//     res.render("/profile", templateVars)
//   } else {
//     res.redirect('/login');
//   }
// })

//Login Routes

// Login Page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
  };
  res.render("login", templateVars);
});

// let testName = req.body.username;
// let testPassword = req.body.password;
// if (users[testName] && users[testName] === testPassword){
//   res.cookie("user",testName);
//   res.redirect("/profile");
// } else {
//   res.redirect("/login");
// }


function emailLookup (email, password) {
  
  for (let key in users) {
    console.log("tests", key, users[key])
    if (users[key].email === email && users[key].password === password) {
      return users[key];
    }
       else if(users[key].email === null) {
      return res.status(403).send("Hey BUDDAY! This e-mail cannot be found!")
    }
  }
}

//Login submit  handlers
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send("Hey BUDDAY! You forgot to input e-mail or password!")
  }
  const user = emailLookup(email, password);
  console.log("is this the user?", user)
  if (user) {
    res.cookie("user_id", email)
  };
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

  res.redirect("/urls");
});


//

app.post("/login", (req, res) => {
  const templateVars = {
    user: req.body.user,
  };
  res.cookie('user_id', req.body.user);
  res.redirect("/urls")
})

// Logout Route

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  longURL = req.body.longURL;
  shortURL = req.params.id;
  urlDatabase[req.params.id] = longURL;
  res.redirect("/urls");
})

// Registration Routes
//Registration Route
app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/register")
})

//Registration submit  handler
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send("Hey BUDDAY! You forgot to input e-mail or password!")
  }
  for (let key in users) {
    if (users[key].email === email) {
      return res.status(400).send("Hey BUDDAY! This e-mail isn't allowed!")
    }
  }
console.log(email);
  
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password
  }
  console.log("users", users);
  res.cookie("user_id", id);
  res.redirect("/urls");
});



app.get("/register", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] };
  res.render("register", templateVars) //use same name as file, no /(for res.render) unless redirecting(then / is needed)
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  console.log("req.params:", req.params);
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  // const user = users[req.cookies.user_id]
  const templateVars = {
    user: req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars); //passes ejs directory, then looks for file urls_index
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
