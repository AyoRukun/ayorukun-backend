const multer = require("multer");
const {extname} = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.').slice(-1);
        console.log("fileExtension",fileName)
        console.log("fileExtension",fileExtension)
        cb(null, `${fileName.replaceAll(" ", "_")}-${Date.now()}.${fileExtension}`);
    }
});


async function fileFilter(req, file, cb) {

    // Check if the file is an image with the allowed extensions
    const fileExtension = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4'];

    const isImage = file.mimetype.startsWith('image/');
    const isAllowedExtension = allowedExtensions.includes(fileExtension);

    if (!isImage || !isAllowedExtension) {
        cb(new Error('Invalid file type. Only image files (PNG, JPG, JPEG, GIF, and MP4) are allowed.'), false);
    }

    cb(null, true);
}

const limits = {
    fileSize: 10 * 1024 * 1024,  // 10 MB
    files: 5,
};

module.exports = multer({ storage, limits, fileFilter }).any();
