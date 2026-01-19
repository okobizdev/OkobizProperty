import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';
import { UploadConfig, UploadedFile, UploadResult } from '../types/imageUploader.type';

class ImageUploader {
  private baseUploadPath: string;
  private basePublicUrl: string;

  constructor() {
    this.baseUploadPath = path.join(process.cwd(), 'uploads'); // Base path for uploads
    this.basePublicUrl = '/uploads'; // Updated to remove '/api/v1'
  }

  // Generate unique filename
  private generateFileName(originalName: string, folder: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    return `${baseName}-${timestamp}-${randomString}${ext}`;
  }

  // Create upload directory if it doesn't exist
  private async ensureUploadDir(uploadPath: string): Promise<void> {
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }
  }

  // Delete old files
  public async deleteFiles(filePaths: string | string[]): Promise<void> {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

    for (const filePath of paths) {
      try {
        if (filePath && !filePath.startsWith('http')) {
          // Convert public URL to file path
          const actualPath = filePath.startsWith(this.basePublicUrl)
            ? path.join(this.baseUploadPath, filePath.replace(this.basePublicUrl, ''))
            : path.join(this.baseUploadPath, filePath);

          await fs.access(actualPath);
          await fs.unlink(actualPath);
          console.log(`Deleted file: ${actualPath}`);
        }
      } catch (error) {
        console.warn(`Failed to delete file: ${filePath}`, error);
      }
    }
  }

  // Configure multer storage
  private createMulterStorage(config: UploadConfig): multer.StorageEngine {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadPath = path.join(this.baseUploadPath, config.folder);
        await this.ensureUploadDir(uploadPath);
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const fileName = this.generateFileName(file.originalname, config.folder);
        cb(null, fileName);
      },
    });
  }

  // Create multer upload middleware for multiple fields
  public createMultiFieldUploadMiddleware(fields: { name: string; maxCount?: number }[], config: UploadConfig) {
    const storage = this.createMulterStorage(config);

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const allowedTypes = config.allowedTypes || [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
        'image/avif',
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
      }
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: config.maxSize || 5 * 1024 * 1024, // 5MB default
      },
    });

    return upload.fields(fields);
  }

  // Create multer upload middleware (single field or array)
  public createUploadMiddleware(config: UploadConfig) {
    const storage = this.createMulterStorage(config);

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const allowedTypes = config.allowedTypes || [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
        'image/avif',
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
      }
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: config.maxSize || 5 * 1024 * 1024, // 5MB default
      },
    });

    if (config.multiple) {
      return upload.array('images', config.maxCount || 10);
    } else {
      return upload.single('image');
    }
  }

  // Process and save uploaded files
  public async processUpload(
    req: Request,
    config: UploadConfig,
    oldFiles?: string | string[]
  ): Promise<UploadResult> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const file = req.file as Express.Multer.File | undefined;

      if (!files && !file) {
        return { success: false, error: 'No files uploaded' };
      }

      // Delete old files if provided
      if (oldFiles) {
        await this.deleteFiles(oldFiles);
      }

      const uploadedFiles: UploadedFile[] = [];
      const filesToProcess = files || (file ? [file] : []);

      for (const uploadedFile of filesToProcess) {
        const originalPath = uploadedFile.path;
        const finalPath = originalPath;

        const publicUrl = `${this.basePublicUrl}/${config.folder}/${uploadedFile.filename}`;

        uploadedFiles.push({
          fieldname: uploadedFile.fieldname,
          originalname: uploadedFile.originalname,
          filename: uploadedFile.filename,
          path: finalPath,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype,
          url: publicUrl,
        });
      }

      return {
        success: true,
        files: config.multiple ? uploadedFiles : undefined,
        file: !config.multiple ? uploadedFiles[0] : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Update files (replace old with new)
  public async updateFiles(
    req: Request,
    config: UploadConfig,
    oldFiles: string | string[]
  ): Promise<UploadResult> {
    return this.processUpload(req, config, oldFiles);
  }

  // Validate file URLs
  public validateFileUrls(urls: string | string[]): boolean {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    return urlArray.every(
      (url) =>
        typeof url === 'string' && (url.startsWith('http') || url.startsWith(this.basePublicUrl))
    );
  }
}

// Export singleton instance
export const imageUploader = new ImageUploader();

// Helper function to create upload middleware with error handling
export const createUploadHandler = (config: UploadConfig) => {
  const uploadMiddleware = imageUploader.createUploadMiddleware(config);

  console.log('Upload Middleware Config:', config);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files' });
          }
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

// Helper function to create multi-field upload middleware
export const createMultiFieldUploadHandler = (fields: { name: string; maxCount?: number }[], config: UploadConfig) => {
  const uploadMiddleware = imageUploader.createMultiFieldUploadMiddleware(fields, config);



  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files' });
          }
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

export default imageUploader;
