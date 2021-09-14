import React from "react";
import routes from './config';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import loadable from '@loadable/component';

const RouteWithSubRoute = (route) => {
  let el;
  if(route.component) {
    el = <RouteComponent {...route}/>
  } else {
    el = route.subs.map((r, i) => <RouteComponent key={i} {...r}/>)
  }
  return el;
}
const RouteComponent = (route) => {
  // const LoadableComponent = loadable(() => import(route.component), {
  //   fallback: <div>loading..</div>
  // });
  
  return <Route
      path={route.path}
      render={props => (
      <route.component {...props} />
    )}
  />
}
const withRoutes = () => {
  return (
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoute key={i} {...route} />
      ))}
      <Route path="*" render={() => <div>Not Found</div>} />
    </Switch>
  )
}
export default withRoutes;