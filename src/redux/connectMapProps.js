import * as authActions from "./modules/auth";
import * as userActions from "./modules/users";

const mapStateToProps = state => ({
  logged: state.users.logged,
  isMasterUser: state.users.isMasterUser,
  userInfo: state.users.userInfo,
  ipInfo: state.users.ipInfo,
  provideInfo: state.users.provideInfo,
  categoryGroups: state.users.categoryGroups,
});

const mapDispatchToProps = dispatch => {
  return {
    // checkUser: () => {
    //   dispatch(authActions.checkUser());
    // },
    userCheck: (params) => {
      dispatch(userActions.actionCreators.getProvideUserCheck(params));
    },
    setUserInfo: (info) => {
      dispatch(userActions.actionCreators.setUserInfo(info));
    },
    getIpInfo: (info) => {
      dispatch(userActions.actionCreators.getIpInfo(info));
    },
    setUserTemp: ({ id, username }) => {
      dispatch(authActions.setUserTemp({ id, username }));
    },
    setProvideInfo: (info) => {
			dispatch({type: 'SET_PROVIDE_USER_CHECK', info})
    },
    setCaterotyGroups: (data) => {
      dispatch(userActions.actionCreators.setCaterotyGroups(data));
    }
  };
};
export {mapStateToProps, mapDispatchToProps};