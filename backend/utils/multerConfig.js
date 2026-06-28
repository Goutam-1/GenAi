import multer from "multer";

/**
 * Multer configuration for PDF file uploads.
 * - Stores files in memory (Buffer) for direct processing
 * - Max file size: 5MB
 * - Only accepts PDF files
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

export default upload;
