import { Request } from 'express';
import { diskStorage } from 'multer';
import { StringUtil } from '../utils/string.util';

export const FileOptions = {
  storage: diskStorage({
    destination: './uploads/event-images',
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const ext = file.originalname.split('.').pop();
      const userId = req['user']['id'];
      const timeStamp = new Date().getTime();
      const fileId = StringUtil.randomString();
      cb(null, `${userId}-${fileId}-${timeStamp}.${ext}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const ext = file.originalname.split('.').pop();
    if (ext.match(/[jpg|png]/gi)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};
