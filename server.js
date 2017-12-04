const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var session = require("express-session")
mongoose.connect('mongodb://localhost/test');

var isLoggedIn = function(req, res, next){
  if(req.user){
    next();
  } else {
    res.redirect('/login');
  }
}

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.methods.validPassword = function(candidatePassword){
  return this.password == candidatePassword;
}

var userModel = mongoose.model('User', userSchema);

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    userModel.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/static', express.static('public'))
app.use(session({ secret: "arandomstring" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/home.html')
})

app.get('/motivation', function (req, res) {
  res.sendFile(process.cwd() + '/motivation.html')
})

app.get('/newbies', function (req, res) {
  res.sendFile(process.cwd() + '/newbies.html')
})

app.get('/workoutdirect', function (req, res) {
  res.sendFile(process.cwd() + '/workoutdirect.html')
})

app.get('/register', function (req, res) {
  res.sendFile(process.cwd() + '/register.html')
})

app.post('/register', function (req, res) {
  console.log(req.body);
  var newUser = new userModel(req.body);
  newUser.save(function (err, newUser) {
  //The 'err' var will be set if something went wrong
  if (err) {
      console.log(err);
  } else {
    res.send(req.body.username + ' have registered')
      //Fluffy is now saved into the database!
  }
});
})

app.get('/login', function (req, res) {
  res.sendFile(process.cwd() + '/login.html')
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/login',
                                   failureRedirect: '/register'})
);

// a secret page only logged in users can access. Note we use the isLoggedIn middleware here (which will be called before function(req, res) i)
app.get('/secret', isLoggedIn, function(req, res){
  res.send("This is a secret page. Only logged in users can access this page. You are currently logged in as " + req.user.username);
  // passport.authenticate('local', {failureRedirect: '/register'})
});

app.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
