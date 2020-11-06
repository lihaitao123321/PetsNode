//
module.exports = (scope, cb) => {
  const express = require('express')
  const webApp = express();
  const server = require('http').createServer(webApp);
  const sio = require('socket.io')(server);
  const session = require('express-session');
  const cookieParser = require('cookie-parser')
  const bodyParser = require('body-parser')
  const path = require('path')
  const nunjucks = require('nunjucks')
  const onRender = require('on-rendered')
  const DB = require('./core/mysql')
  // const Io = require('./app/chat/socket.io')
  const Tools = require('./shared/tools')

  //日志
  const logger = scope.logger
  //配置
  const config = scope.config
  //系统配置
  const pkg = require('./package.json')

  //引入所有自定义模块和配置,放到webapp下面
  webApp.scope = scope
  //格式化接受数据
  webApp.use(bodyParser.urlencoded({extended: false}));
  //返回前端json,注意需要跨域下面有设置
  webApp.use(bodyParser.json())
  //cookie使用
  webApp.use(cookieParser('grkdf85d5d5df5d5d5d55d5d5d5d5d55d9rg666ed5fg4dg'))
  //session使用
  // webApp.use(session({
  //   secret: 'keyboard cat',
  //   resave: false,
  //   saveUninitialized: true
  // }))

  //设置静态资根目录
  webApp.use(express.static(path.join(__dirname, 'static')))
  //模板渲染引擎
  nunjucks.configure('./extension/view', {
    autoescape: true,
    express: webApp
  })
  //限流，防止网络爬虫
  webApp.use(onRender())

  try {
    //拦截器
    webApp.all('*', function (req, res, next) {
      //设置跨域
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      next();
    });
    //权监
    webApp.use(function (req, res, next) {
      // console.log(req.session.user);
      next();
    })

    //异常模块引入处理
    const errHandle = require('./extension/error')
    const requestExtension = require('./extension/request')
    const responseExtension = require('./extension/response')
    const contextExtension = require('./extension/context')
    const applicationExtension = require('./extension/application')
    //异常处理
    applicationExtension(webApp)
    webApp.use(contextExtension)
    webApp.use(requestExtension)
    webApp.use(responseExtension)

    //业务调度分发
    require('./dispatch')(webApp)

    //客户端的发出的错误只可能是：路由错误。也就是说是没有找到该找的页面和接口，在 express 中就要这样写：
    webApp.all('*', errHandle.notFound)

    //express 处理错误的中间件形式：(err, req, res, next) 必须是写成这样
    //这个中间件应该是所有中间件的最后的一个，只应该有一个错误处理中间件。
    webApp.use('*', errHandle.serverError)


  } catch (e) {
    logger.error(e)
  }


  //监听端口请求
  server.listen(config.port, () => {
    const host = server.address().address
    const port = server.address().port
    console.log("应用实例", server.address())
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
    logger.info(`${pkg.name} start at http://localhost:${config.port}/`)
    cb(null, webApp)
  })
  //聊天服务启动和处理↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  // Io(sio);



  //监听服务关闭,关闭数据库连接
  webApp.on('close', () => {
    DB.closeDB();
  })

  //链接数据库注册为全局遍量
  global.DB = DB;
  //工具类注册为全局变量
  global.Tools = Tools;

}
