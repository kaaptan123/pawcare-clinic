const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Try to load sharp — if not available, skip resizing gracefully
let sharp;
try { sharp = require('sharp'); } catch(e) { sharp = null; }

const makeUploader = (folder, opts = {}) => {
  const dir = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP) are allowed'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  });

  return upload;
};

// ── Image resize helper (called after multer saves the file) ──
const resizeImage = async (filePath, opts = {}) => {
  if (!sharp) return; // sharp not installed — skip silently
  const { width = 1200, height = null, quality = 82 } = opts;
  try {
    const ext = path.extname(filePath).toLowerCase();
    const isWebp = ext === '.webp';
    const tmp = filePath + '.tmp';
    const sharpInst = sharp(filePath).resize(width, height, { fit:'inside', withoutEnlargement:true });
    if (isWebp) {
      await sharpInst.webp({ quality }).toFile(tmp);
    } else {
      await sharpInst.jpeg({ quality, progressive:true }).toFile(tmp);
    }
    fs.renameSync(tmp, filePath);
  } catch(e) {
    console.warn('Image resize skipped:', e.message);
  }
};

module.exports = { makeUploader, resizeImage };
