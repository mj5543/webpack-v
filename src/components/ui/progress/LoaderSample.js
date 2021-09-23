import React from 'react';
import './spinner.css';
export const BasicSpinner = (props) => {
  if(props.isShow) {
    return (
      <div className="loader-dimmed">
        <div className="loader-center-position spinner-col-sm-2 col-xs-4 text-center">
          <div className="spinner-loader" />
        </div>
      </div>
    )
  } else {
    return null;
  }
}
export const BallLoader = () => {
  return (
    <div className="spinner-col-sm-2 col-xs-4 text-center">
      <div className="ball-loader" />
    </div>
  )
}
export const PulseLoader = (props) => {
  if(props.isShow) {
    return (
      <div className="loader-dimmed">
        <div className="loader-center-position spinner-col-sm-2 col-xs-4 text-center">
          <div className="pulse-loader" />
        </div>
      </div>
    )
  } else {
    return null;
  }
}
export const WobblebarLoader = (props) => {
  if(props.isShow) {
    return (
      <div className="loader-dimmed">
        <div className="loader-center-position spinner-col-sm-2 col-xs-4 text-center">
          {/* <div class="cp-spinner cp-skeleton" /> */}
          <div className="wobblebar-loader" />
        </div>
      </div>
    )
  } else {
    return null;
  }
}
 
const LoaderSample = () => {
    return (
      <div className="spinner-sample-container">
        <div className="spinner-row"> 
          <BasicSpinner />
          {/* <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="spinner-loader" />
          </div> */}
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="throbber-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="refreshing-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="heartbeat-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="gauge-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="three-quarters-loader" />
          </div>
        </div>
        <div className="spinner-row">
            <WobblebarLoader />
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="atebits-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="whirly-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="flower-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="dots-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="circles-loader" />
          </div>
        </div>
        <div className="spinner-row">
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="plus-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="pulse-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="hexdots-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="inner-circles-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="pong-loader" />
          </div>
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="timer-loader" />
          </div>
        </div>
        <div className="spinner-row"> 
          <div className="spinner-col-sm-2 col-xs-4 text-center">
            <div className="ball-loader" />
          </div>
        </div>
      </div>
    

    );
 };
 
 export default LoaderSample;