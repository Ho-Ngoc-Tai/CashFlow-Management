import { call, put, takeLatest, all } from "redux-saga/effects";
import { get, post } from "@commons/ajax/client";
import { NEXT_AUTH_LOGIN, NEXT_AUTH_LOGOUT, NEXT_AUTH_ME } from "@routes/next.api";
import {
  loginAction,
  loginSuccess,
  loginFailure,
  getUserInfoAction,
  getUserInfoSuccess,
  getUserInfoFailure,
  logoutAction,
  logoutSuccess,
} from "@stores/reducers/auth";
import { toast } from "sonner";
import { AUTH_SIGNIN_PAGE, HOME_PAGE } from "@routes/web";

function* handleLogin(action: ReturnType<typeof loginAction>): Generator<any, void, any> {
  try {
    const response = yield call(post, NEXT_AUTH_LOGIN, action.payload);
    if (response?.code === 200 || response?.success) {
      yield put(loginSuccess({ user: response.data?.user || response.data }));
      toast.success("Đăng nhập thành công!");
      if (typeof window !== "undefined") {
        window.location.href = HOME_PAGE;
      }
    } else {
      yield put(loginFailure(response?.message || "Đăng nhập thất bại"));
      toast.error(response?.message || "Đăng nhập thất bại");
    }
  } catch (error: any) {
    yield put(loginFailure(error?.message || "Lỗi hệ thống đăng nhập"));
    toast.error(error?.message || "Lỗi kết nối");
  }
}

function* handleGetUserInfo(): Generator<any, void, any> {
  try {
    const response = yield call(get, NEXT_AUTH_ME);
    if (response?.code === 200 || response?.success) {
      yield put(getUserInfoSuccess(response.data));
    } else {
      yield put(getUserInfoFailure(response?.message));
    }
  } catch (error: any) {
    yield put(getUserInfoFailure(error?.message));
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    yield call(post, NEXT_AUTH_LOGOUT);
    yield put(logoutSuccess());
    toast.info("Đã đăng xuất");
    if (typeof window !== "undefined") {
      window.location.href = AUTH_SIGNIN_PAGE;
    }
  } catch {
    yield put(logoutSuccess());
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(loginAction.type, handleLogin),
    takeLatest(getUserInfoAction.type, handleGetUserInfo),
    takeLatest(logoutAction.type, handleLogout),
  ]);
}
