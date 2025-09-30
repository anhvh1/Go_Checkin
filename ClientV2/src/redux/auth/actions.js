const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  checkAuthorization: () => ({
    type: actions.CHECK_AUTHORIZATION
  }),
  login: (dataLogin) => ({
    type: actions.LOGIN_REQUEST,
    payload: {dataLogin}
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};
export default actions;
