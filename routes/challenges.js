let Router = require('express-promise-router');
let { ValidationError } = require('objection');

let requireLogin = require('../requireLogin');

let Challenge = require('../models/Challenge');

let router = new Router();

router.get('/new', requireLogin, (req, res) => {
  res.render('challenges/new');
});

router.post('/', requireLogin, async (req, res) => {
  let challengeData = req.body.challenge;

  try {
    let challenge = await req.user.$relatedQuery('challenges').insert(challengeData);

    res.redirect(`/challenges/${challenge.id}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      let errors = error.data;

      console.log(errors);

      res.render('challenges/new', { errors });
    } else {
      throw error;
    }
  }
});

router.get('/:challengeId', async (req, res) => {
  let challengeId = req.params.challengeId;
  let challenge = await Challenge.query().findById(challengeId);

  if (challenge) {
    console.log(challenge);
    res.render('challenges/show', { challenge });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
