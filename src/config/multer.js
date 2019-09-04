// configuração para upload d arquivos
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // cb=callback
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const acceptedFormat = ['image/png', 'image/jpg', 'image/jpeg'].find(
      f => f === file.mimetype
    );

    if (!acceptedFormat) {
      return cb(new Error('Invalid type'));
    }

    return cb(null, true);
  },
};
