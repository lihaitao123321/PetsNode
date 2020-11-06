//初始化各个模块
const async = require('async')
function main() {
  //例子
  // async.auto({
  //   func1: function (callback, results) {
  //     callback(null, "abc", "bbc");
  //   },
  //
  //   func2: function (callback, results) {
  //     console.log("Print#1:\n" + util.inspect(results));
  //     callback(null, { "puncha": "during" });
  //   },
  //   func3: ["func2", function (callback, results) {
  //     console.log("Print#2:\n" + util.inspect(results));
  //     callback(null, 3);
  //   }],
  //   func4: ["func1", "func3", function (callback, results) {
  //     console.log("Print#3:\n" + util.inspect(results));
  //     callback(null);
  //   }]
  // });
  // async.auto接受一个对象，即键值对，其每一个属性，就是一个你要执行的函数逻辑，而依赖关系通过属性名指定。
  // 上面代码的意思是，func1和func2相互独立，没有依赖，func3依赖于func2，func4依赖于func1，func3（其实也间接依赖于func2）。
  // 那么，根据人脑判断，func1和func2可以并行执行，func3可以和func1并行但是需要等待func2，func4最后执行。
  //scope 返回导出模块的对象集合
  async.auto({
    //配置
    config(cb) {
      cb(null, require('./config'))
    },
    //日志
    logger: ['config', (scope, cb) => {
      const logger = require('./module/logger')(scope.config)
      cb(null, logger)
    }],
    //暂时没用
    redis: ['config', (scope, cb) => {
      const redis = require('./module/redis')
      cb(null, redis)
    }],
    //公用模块
    util(cb) {
      cb(null, require('./module/util'))
    },
    //自定义modules
    module: ['util', 'logger', 'redis', (scope, cb) => {
      cb()
    }],
    //配置
    web: ['config', 'module',(scope, cb) => {
      const web = require('./web')(scope, cb)
    }],
    //加载模块完毕执行
    ready: ['module', 'web', (scope, cb) => {
      cb()
    }]
  }, function(err, scope) {
    const logger = scope.logger
    logger.info('app running')
  })
}
main()
