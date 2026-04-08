var express = require('express'); // 引入 Express 框架
var router = express.Router(); // 創建一個新的路由器實例

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); // 返回一個字串作為回應
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
