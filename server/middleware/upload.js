const multer = require('multer');
const path = require('path');
const fs = require('fs');

const makeUploader = (folder) => {
  const dir = path.join(__dirname, `../uploads/${folder}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename:    (req, file, cb) => cb(null, `${folder}_${Date.now()}${path.extname(file.originalname)}`),
  });
  return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only images allowed'));
    }
  });
};

module.exports = { makeUploader };
