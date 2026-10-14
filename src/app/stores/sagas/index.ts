import { all, fork } from "redux-saga/effects";
import authSaga from "./auth";
import cashflowSaga from "./cashflow";
import transactionsSaga from "./transactions";
import integrationsSaga from "./integrations";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(cashflowSaga),
    fork(transactionsSaga),
    fork(integrationsSaga),
  ]);
}
