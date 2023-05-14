const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join('uploads'));
    },
    filename(req, file, cb) {
        const { originalname } = file;
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${originalname}`);
    },
});

const upload = multer({ storage });

module.exports = upload;
