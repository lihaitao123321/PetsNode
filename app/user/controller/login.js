const userService = require('../service/userService');
module.exports = (req, res, next) => {
  // res.json({code:0,msg:'登陆ok!'});
  let phone=req.query.phone || req.body.phone;
  let passWord=req.query.passWord || req.body.passWord;

  userService.login(phone,Tools.md5(passWord),(loginInfo)=>{
    //用户权监
    if(loginInfo){
      // console.log(req.cookies)
      // req.session.user=loginInfo;
      // console.log('登录设置')
      // console.log(req.cookies)
      Tools.json(res,0,'登陆成功',loginInfo);
    }else{
      Tools.json(res,-1,'登陆失败');
    }
  })
}
