import React, {useState} from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
require('dotenv').config();

// const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
// const appId = '265795955063722';
let appId = process.env.REACT_APP_FACEBOOK_TEST_APP_ID;
if (process.env.NODE_ENV === 'production') {
  appId = process.env.REACT_APP_FACEBOOK_APP_ID
}

const FaceBookLoginBtn = ({ location, history, onFacebookLogin }) =>{

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const responseFacebook = async(res) => {
      console.log('onSuccess ::', res);
      if(res.status === 'unknown') {
        return;
      }
    const params = {appId: res.userID, email: res.email, name: res.name, imageUrl: res.picture.data.url, provider: res.graphDomain}
      // const { googleId, profileObj : { email, name, imageUrl } } = response;
      setIsLoggedIn(true)
      // console.log('email---', email)
      await onFacebookLogin (params);
  }

  const onFailure = (error) => {
      console.log(error);
  }

  return(
      <div className="d-inline-block wp-100">
          <FacebookLogin
            appId={appId}
            fields="name,email,picture"
            autoLoad={false}
            callback={responseFacebook}
            render={renderProps => (
              // <button type="button" className="btn btn-md" onClick={renderProps.onClick} disabled={renderProps.disabled}>
              //   <div className="facebook-icon-sq" style={{width: '30px', height: '30px'}}></div>
              // </button>
              <button className="custom-btn btn-17" style={{width: '100%'}} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <span className="wp-100">facebook account</span>
                <span className="wp-100">
                  <div className="facebook-icon-sq ml-10 btn-fl" style={{width: '30px', height: '30px', marginTop: '5px'}} />
                  <div className="d-inline-block">Facebook</div>
                </span>
              </button>
          )}
          />
      </div>
  )
}

export default FaceBookLoginBtn;