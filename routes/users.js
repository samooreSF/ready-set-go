var express = require('express');
let Router = require("express-promise-router");
let router = new Router();

let User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});

module.exports = router;
