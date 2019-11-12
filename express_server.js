const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');


app.use(cookieSession({
  name: 'session',
  keys: ['hello', 'there'],

// Cookie Options

maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": { longUrl: "http://www.lighthouselabs.ca", userID: "aJ48lW" }, 
  "9sm5xK": { longUrl: "http://www.google.com", userID: "userRandomID" }
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


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) { 
    
    const user = users[req.session.user_id]
    let username = null
    if (user) {
      username =  user.email
    }
    let templateVars = {username}
    res.render("urls_new", templateVars);
  }
  else { res.redirect('/login')
}
});

app.get("/urls", (req, res) => {
  console.log(users)
  const user = users[req.session.user_id]
  let username = null
  if (user) {
    username =  user.email
  }
  let templateVars = { urls: urlsForUser(req.session.user_id), username };
  res.render("urls_index", templateVars);
});

//Cannot go into short URL unless it's yours !
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id]
  let username = null
  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    username =  user.email
    let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, username};
    res.render("urls_show", templateVars);
  }
  else {res.status(400);
    res.send('Not your URL')
  }
});

app.post("/urls", (req, res) => {
  var shorturl = generateRandomString()
  const newUrl = {
    longUrl: req.body.longURL,
    userID: req.session.user_id
  }
  urlDatabase[shorturl] = newUrl
  res.redirect(`/urls/${shorturl}`);        
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL )
  const longURL = urlDatabase[req.params.shortURL].longUrl
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id){
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`); 
  }
}); 

app.post("/urls/:shortURL", (req, res) => { 
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL].longUrl = req.body.longURL;
    res.redirect('/urls') 
  }
  else { 
    res.status(400);
    res.send('Not Your URL !')
  }
});

app.post("/logout", (req,res) => { 
  req.session = null
  res.redirect('/urls')
}); 

app.get("/register", (req, res) => {
  let templateVars = {username: null }
  res.render("register", templateVars)
}); 

app.post("/register", (req, res) => { 
  //create new user in database
  var userId = generateRandomString()
  //if email or password empty return error 400
  if (req.body.email === ""){
    res.status(400);
    res.send('Please Input Email !');  
  }  
  else if (req.body.password === "") {
    res.status(400);
    res.send("Please Input Password !")
  }
  // if email already in use return error 400
  else if (emailVerify(req.body.email) === true) {
    res.status(400);
    res.send('Email already in use !');
  }
  //set cookie w that user id
  else {
    users[userId] = {id: userId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)}
    req.session.user_id = userId
    res.redirect("/urls")
  }
}); 

app.get("/login", (req, res) => {
  let templateVars = {username: req.session.user_id}
  res.render("login", templateVars)
}); 

app.post("/login", (req, res) => {
  if (emailVerify(req.body.email) === false) {
    res.status(400);
    res.send('Invalid Email !');
  }
  
  else if (emailVerify(req.body.email) === true) {
    var hash = bcrypt.hashSync('password', 10);
    
    if (passwordVerify(bcrypt.hashSync(req.body.password, 10)) === true) {
      var userId = getUserId(req.body.email)
      req.session.user_id = userId
      res.redirect("/urls")
    }
  }
});


// generates a random alphanumerical string of 6 characters
function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6 ; i++)
  text += charset.charAt(Math.floor(Math.random() * charset.length));
  
  return text;
}

// Verifies your email 
function emailVerify(email) { 
  for (user in users) {
    if(users[user].email === email){
      return true
    }    
  }
  return false 
} 

// Verifies your password
function passwordVerify(password){
  for (user in users){
    if(bcrypt.compareSync) {
      return true
    }
  }
  return false 
}

// Gets the user ID 
function getUserId(email) { 
  for (userId in users) {
    if(users[userId].email === email) {
      return users[userId].id
    }    
  }
  return false 
}

//Gets the URL's for this user 
function urlsForUser(userId) { 
  const output = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userId){
      var id = urlDatabase
      var url = urlDatabase[shortURL].longUrl
      output[shortURL] = {longUrl: urlDatabase[shortURL].longUrl, userID: userId}  
    }
  }
  return output
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
