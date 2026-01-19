export interface UploadConfig {
  folder: string;
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[];
  multiple?: boolean;
  maxCount?: number; // for multiple uploads
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  url: string; // Public URL
}

export interface UploadResult {
  success: boolean;
  files?: UploadedFile[];
  file?: UploadedFile; // for single upload
  error?: string;
}