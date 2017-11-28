const express = require('express')
const app = express()
var bodyParser = require('body-parser')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

app.use('/static', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// app.get('/', function (req, res) {
//   res.send('Hi!')
// })
var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

var userModel = mongoose.model('User', userSchema);


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
  res.send('Log In!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
