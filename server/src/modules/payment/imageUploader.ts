import fs from 'fs/promises';
import path from 'path';
import { Request } from 'express';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const saveUploadedFile = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadResult> => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const uploadFolder = path.join(process.cwd(), 'uploads', folder);
    await fs.mkdir(uploadFolder, { recursive: true });

    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const fileName = `${file.fieldname}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}${ext}`;
    const filePath = path.join(uploadFolder, fileName);

    await fs.writeFile(filePath, file.buffer);

    return { success: true, url: `/uploads/${folder}/${fileName}` };
  } catch (err: any) {
    console.error('Error saving uploaded file:', err);
    return { success: false, error: err.message || 'Failed to save file' };
  }
};
