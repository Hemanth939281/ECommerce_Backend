const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.post('/upload', auth, authAdmin, async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send({ msg: "No file was uploaded" });

        console.log(req.files);

        const file = req.files.file;

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "Size too large" });
        }


        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect" });
        }

        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'test' });
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });

    } catch (err) {
        console.error("Error in upload route:", err);
        res.status(500).json({ msg: err.message });
    }
});

router.post('/destroy', auth, authAdmin, async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) return res.status(400).json({ msg: "No image selected" });

        const result = await cloudinary.v2.uploader.destroy(public_id);

        res.json({ msg: "Image deleted successfully" });
    } catch (err) {
        console.error("Error in destroy route:", err);
        return res.status(500).json({ msg: err.message });
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    });
}

module.exports = router;
