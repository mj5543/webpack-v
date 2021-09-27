import './'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import "./scss/app.scss";
import "simplebar/dist/simplebar.css";
import "./css/app.css";
import "./css/icons.css";
import "./css/base.css";
import "./css/buttons.css";
import "./css/contents.css";
import "./css/inputs.css";
import "./css/background.css";
import "./components/ui/progress/cp-spinner.css";
import "./components/ui/progress/progress.css";
import NavbarExpandTop from './components/navs/NavbarExpandTop';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import AuthContainer from './components/auth/AuthContainer';
// import LifeCycle from './components/category/menual/react/LifeCycle';
// import ReactEvent from './components/category/menual/react/ReactEvent';
// import Intro from './components/category/menual/react/Intro';
// import Resume from './components/resume/Resume';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarContainer from './components/navs/SidebarContainer';
// const BaseContainer = () => import(/* webpackChunkName: "BaseContainer" */'./components/auth/BaseContainer')
import Routes from './routes';


const App = (props) => {
  return (
    <div className="wrapper">
      <SidebarContainer {...props} />
      <div className="main">
      <NavbarExpandTop />
      <Routes {...props} />

        {/* <Route exact path="/" component={ContentsContainer}/>
        <Switch>
          <Route path="/profile/:name" component={Profile}/>
          <Route path="/profile" component={Profile}/>
        </Switch>
        <Switch>
          <Route path="/auth/login/:name" component={BaseContainer}/>
          <Route path="/auth/login" render={() => <BaseContainer store={props.store}/>}/>
        </Switch>
        <Switch>
          <Route path="/auth/sign-up/:name" component={SignUp}/>
          <Route path="/auth/sign-up" component={SignUp}/>
        </Switch>
        <Route path="/posts" component={Posts}/>
        <Route path="/resume" component={Resume}/>
        <Route path="/react/lifecycle" component={LifeCycle}/>
        <Route path="/react/event" component={ReactEvent}/>
        <Route path="/react/intro" component={Intro}/>
        <Route path="/admin" component={AdminContainer}/>
        <Route path="/testing" component={Testing}/> */}
        {/* <Route path="*">
          <NoMatch />
        </Route> */}
        <AuthContainer />
        {/* info, success, warning, error, default, dark */}
        <ToastContainer
          position="bottom-center"
          hideProgressBar={false}
          autoClose={1500} />
        </div>
      </div>

  )
}
function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
export default App;
