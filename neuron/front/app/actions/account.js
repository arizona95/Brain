export const SIGNIN_BY_TOKEN = 'SIGNIN_BY_TOKEN';
export const SIGNIN_BY_TOKEN_SUCCESS = 'SIGNIN_BY_TOKEN_SUCCESS';
export const SIGNIN_BY_TOKEN_FAIL = 'SIGNIN_BY_TOKEN_FAIL';

export const SIGNIN = 'SIGNIN';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNIN_FAIL = 'SIGNIN_FAIL';

export const SIGNOUT = 'SIGNOUT';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
export const SIGNOUT_FAIL = 'SIGNOUT_FAIL';

export const signInByToken = token => ({
  type: SIGNIN_BY_TOKEN,
  payload: {
    request: {
      method: 'POST',
      url: '/users/token',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  },
});
export const signIn = (username, password) => ({
  type: SIGNIN,
  payload: {
    request: {
      method: 'POST',
      url: '/users/singin',
      data: { username, password },
    },
  },
});
export const signOut = () => ({
  type: SIGNOUT,
  payload: {
    method: 'POST',
    request: {
      url: '/users/signout',
    },
  },
});
