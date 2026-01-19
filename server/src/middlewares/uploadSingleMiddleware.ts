import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage(); // keep file in memory buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 5 MB
  },
});

// middleware wrapper for single file
const singleUpload = (fieldName: string) => {
  const handler = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large (max 10MB)" });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: "File upload failed" });
      }
      next();
    });
  };
};

export { singleUpload };
