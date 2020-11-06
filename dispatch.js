//业务调度分发，既设置子路由
module.exports = (app) => {
  // app.use-挂载子应用,子应用是一个的完整的application
  //  用户模块
  app.use('/user', require('./app/user'));
  //  聊天模块
  app.use('/chat', require('./app/chat'));
  //上传文件等
  app.use('/public', require('./app/public'));
}
