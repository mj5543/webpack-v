const express = require('express');
const compression = require('compression');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs')
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const pathRoot = path.join(__dirname)
// const pathRoot = path.join(__dirname, "dist")
// const PORT = 3000;
// const manifest = require(path.join(__dirname, 'asset-manifest.json'));
// const runtimeContent = fs.readFileSync(manifest['runtime.js'], 'utf-8')
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/dist")));
// }
app.use(compression());
app.use(express.static(pathRoot));
// fs.writeFileSync()
fs.writeFile(path.join(__dirname, 'error.html'), '',function(err){      
  // writeFile()메소드는 1파라미터: 파일이름 2파라미터: 파일에 쓸 내용 3파라미터: 콜백 함수 
      
     if(err){
         console.log('Error' + err);
     } 
      
      console.log('error.html 파일에 데이터 쓰기 완료');
  });
app.use(cors());
const userRouter = require('./routes/user.js')
const postsRouter = require('./routes/posts.js')
const adminRouter = require('./routes/admin.js')
app.get("/api/fileconfig", (req, res) => {
  const config = {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
  res.send(config);
});
app.get('/sitemap.xml', (req, res)=> {
  res.sendFile(path.join(__dirname, "sitemap.xml"));
  // res.sendFile(path.join("public", "sitemap.xml"));
  //res.sendFile(path.join(__dirname, "index.html"));
  // res.send(`<script>${runtimeContent}</script>`);
});

app.use(userRouter);
app.use(postsRouter);
app.use(adminRouter);
// app.set('trust proxy', true);
// app.render()
// app.get('/user/:id', (req, res) => {
//   return app.render(req, res, '/user', { id: req.params.id });
// });
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });
console.log('__dirname:: ', __dirname);
console.log('process.cwd():: ', process.cwd());
app.set('views', pathRoot); // ejs engine looks for ejs files in public folder
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');


app.get('*', (req, res)=> {
  // res.sendFile(path.join(__dirname, "dist", "index.html"));
  res.render('index');
  //res.sendFile(path.join(__dirname, "index.html"));
  // res.send(`<script>${runtimeContent}</script>`);
});

console.log('process.env.PORT', process.env.PORT);
console.log('process.env', process.env);
// // app.set('views', path.join(__dirname, 'dist')); // ejs engine looks for ejs files in public folder
// app.set('views', path.join(__dirname, 'dist')); // ejs engine looks for ejs files in public folder
// app.get('*', function (req, res) {
//   // res.sendFile(path.join(__dirname, "dist", "index.html"));
//   res.render('index');
// }); 
app.set('port', PORT);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port + server.address().address + server.address().family);
});
// app.listen(PORT, () => {
//   console.log('__dirname:: ', __dirname);
//   console.log(`App listening to ${PORT}....`)
//   console.log('Press Ctrl+C to quit.')
// })