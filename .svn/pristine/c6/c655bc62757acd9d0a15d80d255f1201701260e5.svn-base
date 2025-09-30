import {all, takeEvery, put, fork, call} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {getToken, clearToken} from '../../helpers/utility';
import actions from './actions';
import api from "../../containers/Page/config";

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function* ({payload}) {
    const user = payload.dataLogin.User;
    let role = {};
    yield payload.dataLogin.ListRole.forEach((value) => {
      role[value.MaChucNang] = {
        view: value.Xem,
        add: value.Them,
        edit: value.Sua,
        delete: value.Xoa
      };
    });

    yield put({
      type: actions.LOGIN_SUCCESS,
      user,
      role
    });

  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
    yield localStorage.setItem('user_id', payload.user.NguoiDungID);
    yield localStorage.setItem('access_token', payload.user.Token);
    yield localStorage.setItem('role', JSON.stringify(payload.role));
    yield localStorage.setItem('user', JSON.stringify(payload.user));
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* () {
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function* () {
    clearToken();
    yield put(push('/'));
  });
}

export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function* () {
    const userId = getToken().get('userId');
    const accessToken = getToken().get('accessToken');
    if (userId && accessToken) {
      const param = {NguoiDungID: userId, Token: accessToken};
      const response = yield call(api.chiTiet, param);
      if (response.data.Status > 0) {
        let user = response.data.User;
        user = {...user, Token: accessToken};
        let role = {};
        yield response.data.ListRole.forEach((value) => {
          role[value.MaChucNang] = {
            view: value.Xem,
            add: value.Them,
            edit: value.Sua,
            delete: value.Xoa
          };
        });
        if (accessToken) {
          yield put({
            type: actions.LOGIN_SUCCESS,
            accessToken,
            user,
            role,
          });
        }
      } else {
        clearToken();
        yield put(push('/'));
      }
    } else {
      clearToken();
      yield put(push('/'));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
  ]);
}
