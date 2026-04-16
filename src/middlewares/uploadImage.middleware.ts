import multer from "multer";
import fs from "fs";
import path from "path";

/* ensure uploads folder exists */
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Only jpeg, png and webp image files are allowed."));
      return;
    }
    cb(null, true);
  },
}).single("image");

export default uploadImage;