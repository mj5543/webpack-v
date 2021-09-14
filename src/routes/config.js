import React from "react";
import ContentsContainer from "../components/contents/ContentsContainer";
import loadable from '@loadable/component';
import { Main, Posts, Profile, SignIn, SignUp} from '../pages';
import Resume from "../components/resume/Resume";
import BaseContainer from "../components/auth/BaseContainer";
import AdminContainer from "../components/admin/AdminContainer";
import Testing from "../pages/Testing";
// const Testing = loadable(() => import('../pages/Testing'), {
//   fallback: <div>loading..</div>
// });
// const { Main, Posts, Profile, SignIn, SignUp} = loadable(() => import('../pages/index'), {
//   fallback: <div>loading..</div>
// });

const routes = [
  {
    path: "/",
    exact: true,
    component: ContentsContainer,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/resume",
    component: Resume,
  },
  {
    path: "/about",
    subs:[
      {path: "/about/profile", component: Profile},
      {path: "/about/resume", component: Resume},
    ]
  },
  {
    path: "/auth",
    subs:[
      {path: "/auth/login", component: BaseContainer},
      {path: "/auth/sign-up", component: SignUp},
    ]
  },
  {
    path: "/posts",
    component: Posts,
  },
  {
    path: "/admin",
    component: AdminContainer,
  },
  {
    path: "/testing",
    component: Testing,
  },
];

export default routes;