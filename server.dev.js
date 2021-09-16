const express = require('express');
require('dotenv').config({
  path: './.env.development'
});
const app = express();
const path = require('path');
const cors = require('cors');

const root = path.resolve(__dirname, 'dist');
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json()); // json 페이로드 구문을 분석한다 (body-parser 기반)

// webpack-dev-server express 용 설정
const webpack = require('webpack'); // 웹팩
const userRouter = require('./routes/user.js')
const postsRouter = require('./routes/posts.js')
const adminRouter = require('./routes/admin.js')
app.use(userRouter);
app.use(postsRouter);
app.use(adminRouter);
// const webpackConfig = require(path.resolve(__dirname, 'webpack.dev.js')); // 웹팩설정
// const webpackCompiler = webpack(webpackConfig); // 웹팩컴파일러
// const webpackDevMiddleware = require('webpack-dev-middleware')(webpackCompiler, webpackConfig.devServer)
// app.use(webpackDevMiddleware);

// // add hot loading middleware
// const webpackHotMiddleware = require('webpack-hot-middleware')(webpackCompiler);
// app.use(webpackHotMiddleware);
console.log('process.cwd() dev:: ', process.cwd());
app.use(express.static(path.join(__dirname, "dist"))); // 정적파일을 제공한다.


const staticMiddleWare = express.static("dist");
const config = require("./webpack.dev.js")
const compiler = webpack(config);
console.log('config.devServer--', config.devServer);
console.log('config--', config);
const webpackDevMiddleware = require("webpack-dev-middleware")(
  compiler,
  {
    publicPath: config.output.publicPath,
    stats: { colors: true },
  }
)

// 핫 로딩 미들웨어를 추가하자!
const webpackHotMiddleware = 
    require("webpack-hot-middleware")(compiler)

app.use(webpackDevMiddleware);
 // 웹팩dev 미들웨어 다음, static 미들웨어 이전
app.use(webpackHotMiddleware);
// server.use(staticMiddleWare);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.listen(port, () => {
  console.log(`App listening at port: ${port}.`);
})
  