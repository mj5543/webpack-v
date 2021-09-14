import axios from 'axios';
import queryString from 'query-string';
import { isEmpty } from 'lodash';

export const getList = (url, queryParam, headers) => new Promise((resolve, reject) => {
  let callUrl = url;
  if(!isEmpty(queryParam)) {
    callUrl = queryString.stringifyUrl({url: url, query: queryParam});
  }
  axios.get(callUrl, headers).then(res => {
      resolve(res.data.result);
  }).catch(err => {
    console.log(err);
    reject(new Error(err));
    // throw new Error(err);
  });
});

export const getPost = (url, data, headers) => new Promise((resolve, reject) => {
  axios.post(url, data, headers).then(res => {
    resolve(res.data.result);
 }).catch(err => {
     console.log(err);
     reject(new Error(err));
 });
});

export const getUpdate = (url, data, headers) => new Promise((resolve, reject) => {
  axios.put(url, data, headers).then(res => {
    resolve(res);
  }).catch(err => {
      console.log(err);
      reject(new Error(err));
  });
});

export const getDelete = (url, queryParam, headers) => new Promise((resolve, reject) => {
  let callUrl = url;
  if(!isEmpty(queryParam)) {
    callUrl = queryString.stringifyUrl({url: url, query: queryParam});
  }
  axios.delete(callUrl, headers).then(res => {
    resolve(res);
  }).catch(err => {
     console.log(err);
     reject(new Error(err));
  });
});
