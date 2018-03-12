var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __root + '/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, 'photo-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
})
var upload = multer({ storage: storage })

module.exports = upload;