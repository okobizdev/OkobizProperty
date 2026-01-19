import { createUploadHandler, createMultiFieldUploadHandler } from '../utils/imageUploader';
import { UploadConfig } from '../types/imageUploader.type';

// Function to create a dynamic upload middleware
const uploadMiddleware = (config: UploadConfig) => {
  return createUploadHandler(config);
};

// Function to create multi-field upload middleware
const multiFieldUploadMiddleware = (fields: { name: string; maxCount?: number }[], config: UploadConfig) => {
  return createMultiFieldUploadHandler(fields, config);
};

export default uploadMiddleware;
export { multiFieldUploadMiddleware };
