let fs = require('fs');
const webApp = express();
module.exports = (req, res, next) => {
  let file = req.files[0]
  let des_file = "../../upload/" + file.originalname;
  fs.readFile( req.files[0].path, function (err, data) {
    let list = file.originalname.split('.')
    fs.rename(file.path, file.path +'.' + list[list.length - 1], function (err) {
      if( err ){
        Tools.json(res,-1,'上传失败', err);
      }else{
        Tools.json(res,0,'上传成功', `${webApp.scope.config.upload_tmp}/upload_tmp`);
      }
    });
  });
}
