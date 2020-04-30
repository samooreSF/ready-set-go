let Router = require('express-promise-router');
let { ValidationError } = require('objection');
let upload = require('../services/file-upload');
let singleUpload = upload.single('image')

let requireLogin = require('../requireLogin');

let User = require('../models/User');
let Challenge = require('../models/Challenge');
let Videos = require('../models/Videos');
let Category = require('../models/Category');
let Like = require('../models/Like');
let noCategory = [11,12,13,14,15];

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
  let categoryId = await Category.query().select('id').where("name", categoryName)
  let categoryid = categoryId[0].id

  let challenge = await Challenge.query().where("category_id", categoryid ).whereNotIn("video_id",noCategory).withGraphFetched('[category,video ,user]');
  console.log("------LOOK HERE challenge-----")
  console.log(challenge)
  console.log("-----array no category-------")
  // noCategory = noCategory
  console.log(noCategory)

  if (challenge.length > 0) {
    res.render('challenges/show', { challenge });
  } else {
    res.render('challenges/empty');
  }
});


router.get('/likes/:challengeId', async (req,res) => {
  console.log("--------entered----------")
  let challengeId = req.params.challengeId
  challengeId = parseInt(challengeId)
  let userId = req.session.userId
  console.log("-----------challenge and user id-----------")
  console.log(challengeId)
  console.log(userId)
  let likeUpdate = await Like.query().insert({
    challengeId: challengeId,
    userId: userId,
  });
  console.log("-----------likeUpdate-----------")
  console.log(likeUpdate)


  let likeTotal = await Like.query().count('id').where('challenge_id',challengeId);
  console.log("-----------likeTotal-----------")
  likeTotal = likeTotal[0].count
  let challengeData = await Like.query().where('challenge_id',challengeId).withGraphFetched('[user,challenge]')

  console.log("-----------challengeData-----------")
  console.log(challengeData)
  res.redirect('back',{ likeTotal });
});


      //console.log(errors);


  // res.render("challenges/show", )

  router.get('/challengeSubmission/:id', async (req,res) =>{
    console.log("------3. it got here------")
    let title = req.params.id
    console.log(title)
    let responses = await Challenge.query().select('*').where("title", title + " Response").orWhere("title", title + "Response").withGraphFetched('[category, video]');
    console.log("------4. it got here------")
    console.log(responses)
    console.log("-------what's good------")
    let allCategories = await Category.query().orderBy('name', 'DESC');

    // res.render('challenges/new', { allCategories });

    res.render('challenges/challengeResponse',{ title, responses, allCategories })
  })

  router.post('/challengeSubmission',upload.single('fileToUpload'),async (req,res)=>{
    console.log("------1. it got here------")
    let challengeData = req.body.challenge;
    challengeData.categoryId = challengeData.categoryId ? Number(challengeData.categoryId) : challengeData.categoryId;
    console.log(challengeData.title);
    challengeData.title = challengeData.title + " Response"
    challengeData.video = {
      videoLink: req.file.location,
    };

    try {
      let challengeReplies = await req.user.$relatedQuery('challenges').insertGraph(challengeData);
    console.log("------2. it got here CHALLENGE REPLIES------")
    noCategory.push(challengeReplies.video.id)
    console.log(noCategory)
    console.log(challengeReplies)
    res.redirect('back')
    }

    catch(error) {
      if (error instanceof UniqueViolationError) {
        let errors = error.data;

        //console.log(errors);

        res.render('back',{error});
      } else {
        res.render('back');
      }
    }

  })

  router.get('/profile/:username', async (req,res)=>{
    console.log("-----------UP HERE------------")
    username = req.params.username
    console.log("------username params--------")
    console.log(username)
    let userId = await User.query().select("id").where("username",username)
    console.log("--------this is username--------")
    console.log(userId[0].id)
    userId = userId[0].id;
    let challenge = await Challenge.query().where("user_id", userId ).withGraphFetched('[category,video ,user]');
    console.log(challenge)
    res.render('challenges/profile',{challenge})

  })

































module.exports = router;
