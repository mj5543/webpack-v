import React from 'react';
import './progress.css';
 
const LoaderDot = () => {
    return (
    <div className='loader-container'>
      <div className='loader'>
        <div className='loader--dot' />
        <div className='loader--dot' />
        <div className='loader--dot' />
        <div className='loader--dot' />
        <div className='loader--dot' />
        <div className='loader--dot' />
        <div className='loader--text' />
      </div>
    </div>
    );
 };
 
 export default LoaderDot;