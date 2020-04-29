let Router = require('express-promise-router');
let { ValidationError } = require('objection');
let upload = require('../services/file-upload');
let singleUpload = upload.single('image')

let requireLogin = require('../requireLogin');

let Challenge = require('../models/Challenge');
let Videos = require('../models/Videos');
let Category = require('../models/Category');

let router = new Router();

router.get('/new', requireLogin, async (req, res) => {
  let allCategories = await Category.query().orderBy('name', 'DESC');

  res.render('challenges/new', { allCategories });
});

router.post('/', requireLogin, upload.single('fileToUpload'), async (req, res) => {
  let challengeData = req.body.challenge;
  challengeData.categoryId = challengeData.categoryId ? Number(challengeData.categoryId) : challengeData.categoryId;
  challengeData.video = {
    videoLink: req.file.location,
  };

  try {
    let challenge = await req.user.$relatedQuery('challenges').insertGraph(challengeData);

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
  let challenge = await Challenge.query().findById(challengeId).withGraphFetched('[category, video]');

  if (challenge) {
    res.render('challenges/show', { challenge });
  } else {
    res.redirect('/');
  }
});

router.get('/category/:category', async (req, res) => {
  let categoryName = req.params.category
  // let categoryId = await Category.query().select('id').where("category",`${category}`)
  console.log("--------running--------")
  console.log(categoryName)
  console.log(typeof categoryName)
  let categoryId = await Category.query().select('id').where("name", categoryName)

  // .findOne({'category': 'dance'})
  console.log("--------this is new categoryId----------")
  console.log(categoryId)
  let categoryid = categoryId[0].id
  console.log(categoryid)
  // let challengeId = req.params.challengeId;
  let newChallenge = await Challenge.query()
  console.log("------new challenge-------")
  console.log(newChallenge)
  let challenge = await Challenge.query().where("category_id", categoryid ).withGraphFetched('[category, video]');
  console.log("------challenge-----")
  console.log(challenge)

  if (challenge.length > 0) {
    console.log("-------rendering------")
    res.render('challenges/show', { challenge });
  } else {
    res.send('no videos for this category');
  }
});

module.exports = router;
