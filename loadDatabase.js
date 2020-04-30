let Knex = require('knex');
let { Model } = require('objection');

let dbConfig = require('./knexfile');
let knex = Knex(dbConfig.development)

Model.knex(knex);

global.User = require('./models/User');
global.Challenge = require('./models/Challenge');
global.Videos = require('./models/Videos');
global.Category = require('./models/Category');
global.Like = require('./models/Like');
