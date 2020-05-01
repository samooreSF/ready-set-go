const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: 'YJuJAsGuJznrNRsFYiyVIsF8EXbNw2UC/6BRDhwb',
  accessKeyId: 'AKIA2VCVASQBOL46CBSY',
  region:'us-east-1',
})
const s3 = new aws.S3()

const fileFilter = (req,file,cb) =>{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype ===  "video/quicktime" || file.mimetype === "video/MP2T") {
    cb(null,true)
  }
  else {
    cb(new Error('invalid mime type, only JPEG and PNG'), false);
  }
}
const  upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'ready-set-go-app',
    acl:"public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "TESTING_META_DATA"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
module.exports = upload;
