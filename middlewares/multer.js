import multer from "multer";

const storage = multer.diskStorage({
    destination: './tmp/uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const serverUpload = multer({ storage })