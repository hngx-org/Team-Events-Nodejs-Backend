import { Request } from 'express'
import multer from 'multer'
import * as path from 'path'

// multer config
const multerConfig = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    let ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false)
      return
    }
    cb(null, true)
  },
})

export default multerConfig
