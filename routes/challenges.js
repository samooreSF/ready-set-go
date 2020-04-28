let Router = require('express-promise-router');
let { ValidationError } = require('objection');
let upload = require('../services/file-upload');
let singleUpload = upload.single('image')

let requireLogin = require('../requireLogin');

let Challenge = require('../models/Challenge');
let Videos = require('../models/Videos');

let router = new Router();

router.get('/new', requireLogin, (req, res) => {
  res.render('challenges/new');
});

router.post('/', requireLogin, upload.single('fileToUpload'), async (req, res) => {
  let challengeData = req.body.challenge;
  let url = req.file.location
  console.log("-------testing the url--------")
  console.log(url)


  try {
    let challenge = await req.user.$relatedQuery('challenges').insert(challengeData);
    let videos = await Videos.query().insert({
      videoLink:url,
    })
    console.log("---------testing the videos--------")
    console.log(videos)
    console.log(videos.videoLink)

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
  let videos = await Videos.query().select('video_link')
  console.log(challenge.title)
  console.log("------videos table--------")
  console.log(typeof videos)
  console.log(videos)
  console.log("------videos link--------")
  console.log(videos.videoLink)
  console.log("-------------------------")


  if (challenge) {
    console.log(challenge);
    console.log()
    console.log("that was challenge")
    console.log(videos)
    console.log(videos.videoLink)
    res.render('challenges/show', { challenge, videos});
  } else {
    res.redirect('/');
  }
});

module.exports = router;
