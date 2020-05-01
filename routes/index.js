var express = require('express');
let Router = require("express-promise-router");
let router = new Router();

let User = require('../models/User');
let Challenge = require('../models/Challenge');
let Videos = require('../models/Videos');
let Category = require('../models/Category');
let Like = require('../models/Like');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let challengeId = req.params.challengeId;
  let challenge = await Challenge.query().where("user_id",req.session.userId).withGraphFetched('[category, video]');
  console.log("-----tf my homepage at")
  console.log(challenge)
  res.render('homepage', { challenge });
});

router.get('/register', async(req, res) => {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/register', async (request, response) => {
  let email = request.body.user.email;
  let username = request.body.user.username;
  let emailExists = await User.query().where("email", email).count()
  console.log("--------does it exist---------")
  console.log(parseInt(emailExists[0].count))
  emailExists = parseInt(emailExists[0].count)
  let usernameExists = await User.query().where("username", username).count()
  console.log("--------does it exist---------")
  console.log(parseInt(usernameExists[0].count))
  usernameExists = parseInt(usernameExists[0].count)
  if(emailExists > 0) {
    response.render("register",{ invalidEmail:true })
    return
  }
  if(usernameExists > 0) {
    response.render("register", {invalidUsername: true})
    return
  }
  let user = await User.query().insert(request.body.user);

  if (user) {
    request.session.userId = user.id;

    response.redirect('/');
  } else {
    response.render('register');
  }
});

router.get('/login', (request, response) => {
  if (request.user) {
    response.redirect('/');
  } else {
    response.render('login');
  }
});

router.post('/login', async (request, response) => {
  let email = request.body.user.email;
  let password = request.body.user.password;

  let user = await User.query().findOne({ email: email });
  let passwordValid = user && (await user.verifyPassword(password));

  if (passwordValid) {
    request.session.userId = user.id;

    response.redirect('/');
  } else {
    response.render('login', { invalidLogin: true });
  }
});

router.post('/logout', (request, response) => {
  request.session.userId = null;

  response.redirect('/');
});

module.exports = router;
