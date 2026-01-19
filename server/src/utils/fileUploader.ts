import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Check file type for NID uploads
    if (file.fieldname === 'nid') {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed for NID'));
      }
    }
    cb(null, true);
  },
});

export const fileUpload = (fieldName: string) => {
  const handler = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large (max 10MB)',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
        });
      }
      next();
    });
  };
};

// Multiple files upload middleware
export const multipleFilesUpload = (fields: { name: string; maxCount: number }[]) => {
  const handler = upload.fields(fields);

  console.log('Setting up multiple files upload middleware for fields:', fields);

  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large (max 10MB)',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
        });
      }
      next();
    });
  };
};
