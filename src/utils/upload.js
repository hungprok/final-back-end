const multer = require('multer');
const path = require('path');
const pathToUpload = path.join(__dirname, '../../public/uploads')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToUpload)
  },
  filename: function (req, file, cb) {
    console.log(file)
    const allows = ['application/pdf']
    if (!allows.includes(file.mimetype)) {
      const error = new Error('File type is not supported')
      cb(error, undefined)
    }
    cb(null, file.originalname)
    return req.file = file
  }
})

var upload = multer({ storage: storage })

module.exports = upload;