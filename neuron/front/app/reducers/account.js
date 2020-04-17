import {
  SIGNIN,
  SIGNIN_BY_TOKEN,
  SIGNIN_BY_TOKEN_FAIL,
  SIGNIN_BY_TOKEN_SUCCESS,
  SIGNIN_FAIL,
  SIGNIN_SUCCESS,
  SIGNOUT,
  SIGNOUT_FAIL,
  SIGNOUT_SUCCESS,
} from '../actions/account';

const initialState = {
  loading: false,
  user: {},
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
    case SIGNIN_BY_TOKEN:
      return {
        ...state,
        loading: true,
      };
    case SIGNIN_SUCCESS:
    case SIGNIN_BY_TOKEN_SUCCESS:
      localStorage.setItem('token', action.payload.data.token);
      return {
        ...state,
        loading: false,
        user: action.payload.data.user,
        isAuthenticated: true,
      };
    case SIGNIN_FAIL:
    case SIGNIN_BY_TOKEN_FAIL:
    case SIGNOUT_FAIL:
      return {
        ...state,
        loading: false,
      };
    case SIGNOUT:
      return {
        ...state,
        loading: true,
      };
    case SIGNOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {},
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
