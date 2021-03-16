const express = require("express");
const app = express();
const PORT = 8080; // default port 8080;
app.set("view engine", "ejs");

function generateRandomString(length = 6) {
  return Math.random().toString(16).substr(2, length);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  let key = generateRandomString();
  let value = req.body.longURL;
  urlDatabase[key] = value
  
  res.redirect('/urls');        
});

app.post("/urls/:id", (req, res) => {
  longURL = req.body.longURL;
  shortURL = req.params.id;
  console.log(shortURL);
  console.log(longURL);
  urlDatabase[req.params.id] = longURL;
  console.log(urlDatabase[req.params.id]);
  res.redirect("/urls");
})

// app.post("/urls/:id", (req, res) => {
//   const longURL = req.body.longURL;
//   const shortURL = req.params.id;
//   console.log("in edit", shortURL);
//   console.log("in edit",longURL);
//   urlDatabase[shortURL].longURL = req.body.longURL
//   res.redirect("/urls");
// });

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  console.log("req.params:", req.params);
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  // console.log("displaying URLS")
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
