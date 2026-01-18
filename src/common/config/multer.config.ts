import { diskStorage } from 'multer';
import { extname } from 'path';

const ALLOWED_IMAGE_TYPES = /\.(jpg|jpeg|png|gif|webp)$/i;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      const sanitizedName = file.originalname
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      callback(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(ALLOWED_IMAGE_TYPES)) {
      return callback(
        new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};
