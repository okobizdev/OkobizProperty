import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';

const storage = multer.memoryStorage(); // keep file in memory buffer

export const saveNIDFile = async (buffer: Buffer, originalname: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const filename = `${originalname.split('.')[0]}-${timestamp}${path.extname(originalname)}`;
    const uploadFolder = path.join(process.cwd(), 'uploads', '/nid');
    await fs.mkdir(uploadFolder, { recursive: true });

    const filePath = path.join(uploadFolder, filename);
    await fs.writeFile(filePath, buffer);

    // Return the relative path that will be stored in the database
    return `nid/${filename}`;
  } catch (error) {
    console.error('Error saving NID file:', error);
    throw new Error('Failed to save NID file');
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
});

// middleware wrapper for NID upload
const nidUpload = (fieldName: string) => {
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

export default nidUpload;
