import multer from "multer";
import * as path from "path";
import * as fs from "fs";
const dir = path.join(__dirname, '../..', '/public/images/');

const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename : function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.params.id + ext);
  }
})

export const uploader = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('PNG, JPG만 업로드하세요'))
    }
    const url = path.join(dir, `${req.params.id}`);
    if(fs.existsSync(url + '.png') ){
      fs.unlinkSync(url + '.png');
    }
    if(fs.existsSync(url  + '.jpg')){
      fs.unlinkSync(url +  + '.jpg');
    }
    if(fs.existsSync(url  + '.jpeg')){
      fs.unlinkSync(url  + '.jpeg');
    }

    callback(null, true);
  },
  limits:{
    fileSize: 1024 * 1024 * 10
  }
});