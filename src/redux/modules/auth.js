import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as AuthAPI from '../../api/auth';
import { Map } from 'immutable';

const CHANGE_INPUT = 'auth/CHANGE_INPUT'; // input 값 변경
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'; // form 초기화

export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form 

const CHECK_EMAIL_EXISTS = 'auth/CHECK_EMAIL_EXISTS'; // 이메일 중복 확인
const CHECK_USERNAME_EXISTS = 'auth/CHECK_USERNAME_EXISTS'; // 아이디 중복 확인
const SET_USER_TEMP = 'SET_USER_TEMP'


export const checkEmailExists = createAction(CHECK_EMAIL_EXISTS, AuthAPI.checkEmailExists); // email
export const checkUsernameExists = createAction(CHECK_USERNAME_EXISTS, AuthAPI.checkUsernameExists); // username
export const setUserTemp = ({ id, username, token }) => ({
  type: SET_USER_TEMP,
  payload: {
    id,
    username,
    token
  }
});

const initialState = Map({
    register: Map({
        form: Map({
            email: '',
            username: '',
            password: '',
            passwordConfirm: ''
        }),
        exists: Map({
            email: false,
            password: false
        })
    }),
    login: Map({
        form: Map({
            email: '',
            password: ''
        })
    })
});

// reducer
export default handleActions({
  [CHANGE_INPUT]: (state, action) => {
    const { form, name, value } = action.payload;
    return state.setIn([form, 'form', name], value);
  },
  [INITIALIZE_FORM]: (state, action) => {
      const initialForm = initialState.get(action.payload);
      return state.set(action.payload, initialForm);
  },

  ...pender({
        type: CHECK_EMAIL_EXISTS,
        onSuccess: (state, action) => state.setIn(['register', 'exists', 'email'], action.payload.data.exists)
    }),
    ...pender({
        type: CHECK_USERNAME_EXISTS,
        onSuccess: (state, action) => state.setIn(['register', 'exists', 'username'], action.payload.data.exists)
    })
}, initialState);