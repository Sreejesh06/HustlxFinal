import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to accept only images, videos, and audio
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images, videos, and audio
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, and audio files are allowed."));
  }
};

// Configure upload limits
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB limit
};

// Create multer instance
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits,
});
