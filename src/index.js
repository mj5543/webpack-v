import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
// import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import runtimeEnv from '@mars/heroku-js-runtime-env'
// const env = runtimeEnv();
// console.log('runtimeEnv--', env);
ReactDOM.render(<Root />, document.getElementById('root'));
require('dotenv').config();
console.log('index env--', process.env);
// require("@babel/polyfill");
// ReactDOM.render(;
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.register();
