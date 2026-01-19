import multer from "multer";
import path from "path";

// Create the multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/about/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      console.log(`❌ Rejected file type: ${file.mimetype}`);
      cb(null, false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 50
  }
});

export { upload };