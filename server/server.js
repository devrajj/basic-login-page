const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const User = require('../server/models/user.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/html/index.html'));
})
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/html/signupPage.html'));
});
app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.psw;
  let hashPassword = '';
  let userName;
  User.findOne({ email: email }, (err, document) => {
    if (err) {
      res.render(path.join(__dirname, '/../client/html/loginpage.html'), { message: 'Error in connection. Please contact support team' });
    }
    hashPassword = document && document.password ? document.password : null;
    userName = document && document.name ? document.name.toUpperCase() : null;
    if (hashPassword) {
      if (bcrypt.compareSync(password, hashPassword)) {
        res.render(path.join(__dirname, '/../client/html/loginpage.html'), { message: '', userName: userName });
      } else {
        res.render(path.join(__dirname, '/../client/html/loginpage.html'), { message: 'Password doesnot match. Please enter correct password' });
      }
    } else {
      res.render(path.join(__dirname, '/../client/html/loginpage.html'), { message: 'User doesnot exist with the given mail' });
    }
  });
});
app.post('/registerNewUser', async (req, res) => {
  let email = req.body.email;
  let password = req.body.psw;
  let userName = req.body.uname;
  userName = userName.toUpperCase();
  const hashPassword = bcrypt.hashSync(password, salt);
  let foundEmail = await checkIfEmailExists(email);
  if (foundEmail) {
    res.render(path.join(__dirname, '/../client/html/signupSuccess.html'), { message: 'User Already exists with the given email. Please signup with a new email' });
  } else {
    let newusercreated = await createNewUser(email, hashPassword, userName);
    if (newusercreated && newusercreated.success) {
      res.render(path.join(__dirname, '/../client/html/signupSuccess.html'), { message: '' });
    } else {
      res.render(path.join(__dirname, '/../client/html/signupSuccess.html'), { message: 'Error while registering user' });
    }
  }
});
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
})

function checkIfEmailExists(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, document) => {
      if (err) {
        return reject(err);
      }
      return resolve(document);
    });
  })
}

function createNewUser(email, hashPassword, userName) {
  return new Promise((resolve, reject) => {
    const newUser = new User({
      email: email,
      password: hashPassword,
      name: userName
    });
    newUser.save((err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve({ success: true });
      }
    })
  })
}
