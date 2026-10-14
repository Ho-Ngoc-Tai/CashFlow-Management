import { call, put, takeLatest, all, delay } from "redux-saga/effects";
import { get, post } from "@commons/ajax/client";
import { NEXT_INTEGRATIONS_LIST, NEXT_INTEGRATIONS_SYNC } from "@routes/next.api";
import {
  getIntegrationsAction,
  getIntegrationsSuccess,
  getIntegrationsFailure,
  triggerSyncAction,
  triggerSyncSuccess,
} from "@stores/reducers/integrations";
import { toast } from "sonner";

function* handleGetIntegrations(): Generator<any, void, any> {
  try {
    const response = yield call(get, NEXT_INTEGRATIONS_LIST);
    if (response?.code === 200 || response?.success) {
      yield put(getIntegrationsSuccess(response.data));
    }
  } catch (error: any) {
    yield put(getIntegrationsFailure(error?.message));
  }
}

function* handleTriggerSync(action: ReturnType<typeof triggerSyncAction>): Generator<any, void, any> {
  try {
    toast.loading("Đang kết nối Open Banking để đồng bộ dữ liệu giao dịch mới...", {
      id: "sync-toast",
    });
    yield delay(1500);
    const response = yield call(post, NEXT_INTEGRATIONS_SYNC, { id: action.payload.id });
    const lastSync = response?.data?.lastSync || new Date().toISOString();
    yield put(triggerSyncSuccess({ id: action.payload.id, lastSync }));
    toast.success("Đồng bộ dữ liệu ngân hàng thành công!", { id: "sync-toast" });
  } catch {
    toast.error("Đồng bộ thất bại, vui lòng kiểm tra lại chứng thư API.", { id: "sync-toast" });
  }
}

export default function* integrationsSaga() {
  yield all([
    takeLatest(getIntegrationsAction.type, handleGetIntegrations),
    takeLatest(triggerSyncAction.type, handleTriggerSync),
  ]);
}
