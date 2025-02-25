const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/', req.body.image, '.jpg') // Direktori penyimpanan file, pastikan folder uploads tersedia
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Nama file yang diunggah
    }
});

const upload = multer({ storage: storage });

module.exports = upload