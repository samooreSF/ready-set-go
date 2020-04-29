var express = require('express');
let Router = require("express-promise-router");
let router = new Router();

let User = require('../models/User');
let Challenge = require('../models/Challenge');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let saved_challenge = await Challenge.query().findById(userId).withGraphFetched('[category, video]');
if (challenge) {
  res.render('homepage',{saved_challenge});
} else {
  res.redirect('/');
}
});

module.exports = router;
