const express = require('express')
const router = express.Router()
// const ejs = require('ejs')
const connection = require('../db');
// const path = require('path');
// const fs = require('fs')

// fs.readFile(path.join(__dirname, 'error.html'),'utf-8',function(err,data){
//   // readFile 이므로 비 동기식이며, readFile()메소드를 실행하면서 세번쨰 파라미터로 전달된 함수는 파일을 읽어들이는 작업이 끝났을때 호출이 된다. 이때, err,data 를 전달받아 오류 발생여부 확인할 수 있다.
//       console.log(data);             
//     //에러 발생시 err은 오류 데이터가 들어가고 에러 발생하지 않았을 경우 null 값이 들어간다.
//   });
router.use(express.json()); 
router.use(express.urlencoded({ extended: false }))
router.get('/api/category-all', function(request, response) {
  console.log('category-all call::')
  response.header("Access-Control-Allow-Origin", "*");
  const query = `SELECT * FROM node_info`;
  connection.query(query, function(error, results, fields) {
    if (error) {
      console.log('category-all error::', error)
      response.status(500);
      response.render('error', { error: error });
    } else {
      response.send({ result : results });
    }
  });
});
router.get('/api/category-group', function(request, response) {
  const query = `SELECT node_id
  , pnode_id
  , depth
  , sub_yn
  , node_path
  , node_nm
  , node_code
  , use_yn
  FROM node_info WHERE pnode_id = 0`
  connection.query(query, function(error, results, fields) {
    if (error) {
      response.status(500);
      response.render('error', { error: error });
    } else {
      response.send({ result : results });
    }
  });
});
router.get('/api/category-sub-group', function(request, response) {
  console.log('request.query', request.query);
  console.log('rresponse', response);
  connection.query('SELECT * FROM node_info WHERE pnode_id = ?', [request.query.pNodeId], function(error, results, fields) {
    if (error) {
      response.status(500);
      response.render('error', { error: error });
    } else {
      response.send({ result : results });
    }
  });
});
router.get('/api/category-list', (req, res) => {
  console.log('params', req.params);
  console.log('query', req.query);
  const sql = `SELECT node_id
  , pnode_id
  , depth
  , sub_yn
  , node_path
  , node_nm
  , node_code
  , use_yn
FROM  (
     SELECT * 
       FROM node_info
   ORDER BY pnode_id, node_id
     ) node_sorted,
    (SELECT @pv := ?) initial
WHERE   FIND_IN_SET(pnode_id, @pv)
AND   LENGTH(@pv := concat(@pv, ',', node_id))`
  connection.query(sql, [req.query.pNodeId], (err, data) => {
    if (err) {
      res.status(500);
      res.render('error', { error: err });
      res.send({ error : err });
    } else {
      res.send({ result : data });
    }
 
  })
})
router.post('/api/modify-category', function(request, response) {
  // const {name, password, email, appId, provider} = request.body;
  const nodeCode = request.body.nodeCode;
  const nodeName = request.body.nodeName;
  const nodeId = request.body.nodeId;
  const useYN = request.body.useYN;
  const params = [nodeCode, nodeName, useYN, nodeId];
  connection.query('UPDATE node_info SET node_code = ?, node_nm = ?, use_yn = ? WHERE node_id = ?', params,
   (err, results) => {
    if (err) {
      console.error('Error code : ' + err.code);
      console.error('Error Message : ' + err.message);
      throw new Error(err); 
    } else { 
      response.send('success'); 
      response.end();
    }
  });

});
router.post('/api/update-sub-yn', function(request, response) {
  // const {name, password, email, appId, provider} = request.body;
  const nodeId = request.body.pNodeId;
  const subYN = request.body.subYN;
  const params = [subYN, nodeId];
  connection.query('UPDATE node_info SET sub_yn = ? WHERE node_id = ?', params,
   (err, results) => {
    if (err) {
      console.error('Error code : ' + err.code);
      console.error('Error Message : ' + err.message);
      throw new Error(err); 
    } else { 
      response.send('success'); 
      response.end();
    }
  });

});

router.post('/api/regist-category', function(request, response) {
  // const {name, password, email, appId, provider} = request.body;
  const pNodeId = request.body.pNodeId;
  const nodeCode = request.body.nodeCode;
  const nodeName = request.body.nodeName;
  // const nodeId = request.body.nodeId;
  const nodePath = request.body.nodePath;
  const depth = request.body.depth;
  const useYN = request.body.useYN;
  const params = [pNodeId, nodeCode, nodeName, nodePath, depth, useYN];
  connection.query('INSERT INTO node_info (pnode_id, node_code, node_nm, node_path, depth, use_yn) VALUES (?,?,?,?,?,?)', params,
   (err, results) => {
    if (err) {
      console.error('Error code : ' + err.code);
      console.error('Error Message : ' + err.message);
      throw new Error(err); 
    } else { 
      response.send('success'); 
      response.end();
    }
  });

});

module.exports = router