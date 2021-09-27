import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MainContents from '../components/contents/MainContents';
import Welcome from '../components/animation/Welcome';
// import LightHouse from '../components/animation/LightHouse';
import {mapStateToProps} from "../redux/connectMapProps";
import ShootingStar from '../components/animation/ShootingStar';
const Main = (props) => {
  return (
    <div style={{height: '100vh'}}>
      {!props.logged &&
      <div style={{height: '100vh'}}>
        <Welcome />
        <ShootingStar />
      </div>
      }
      {props.logged &&
        <MainContents {...props} />
      }
      {/* <LightHouse /> */}

    </div>
  )
}
export default withRouter(
  connect(
    mapStateToProps,
  )(Main)
);

// export default Main;