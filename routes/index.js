var express = require('express');
let Router = require("express-promise-router");
let router = new Router();

let User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});

router.get('/register', async(req, res) => {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/register', async (request, response) => {
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
