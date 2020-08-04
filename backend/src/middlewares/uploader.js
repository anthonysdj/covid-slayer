const multer = require('multer');
const { MulterError } = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './src/uploads/'),
    filename: (req, file, cb) => cb(null, new Date().getTime() + '_' + file.originalname)
});
const fileFilter = (req, file, cb) => {
    const accepted = ['jpeg', 'png', 'gif'];

    if (! accepted.includes(file.mimetype.split('/')[1])) {
        // there were errors
        console.log(file.mimetype.split('/')[1]);
        cb(new MulterError(400, 'Invalid file type.'), false);
    } else {
        // success save the file
        cb(null, true);
    }
}
const handleFileUpload = (req, res, next) => {
    const fileupload = multer({storage: storage, limits: { fileSize: 2000000 }, fileFilter: fileFilter}).single('avatar');

    fileupload(req, res, function (err) {
        console.log(err);
        if (err) {
            return res.status(422).send('file type invalid or filesize exceeded 2mb');
        }

        // success
        next();
    });
}

module.exports = handleFileUpload;