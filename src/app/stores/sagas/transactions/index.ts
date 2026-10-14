import { call, put, takeLatest, all } from "redux-saga/effects";
import { get, post } from "@commons/ajax/client";
import { NEXT_TRANSACTION_LIST, NEXT_TRANSACTION_RECONCILE } from "@routes/next.api";
import {
  getTransactionsAction,
  getTransactionsSuccess,
  getTransactionsFailure,
  reconcileTxAction,
  reconcileTxSuccess,
} from "@stores/reducers/transactions";
import { toast } from "sonner";

function* handleGetTransactions(action: ReturnType<typeof getTransactionsAction>): Generator<any, void, any> {
  try {
    const response = yield call(get, NEXT_TRANSACTION_LIST, action.payload as Record<string, unknown>);
    if (response?.code === 200 || response?.success) {
      yield put(
        getTransactionsSuccess({
          items: response.data?.items || response.data || [],
          total: response.meta?.total || (response.data?.length ?? 0),
        })
      );
    } else {
      yield put(getTransactionsFailure(response?.message));
    }
  } catch (error: any) {
    yield put(getTransactionsFailure(error?.message));
  }
}

function* handleReconcileTx(action: ReturnType<typeof reconcileTxAction>): Generator<any, void, any> {
  try {
    const response = yield call(post, NEXT_TRANSACTION_RECONCILE, action.payload);
    if (response?.code === 200 || response?.success) {
      yield put(reconcileTxSuccess(action.payload));
      toast.success(`Khớp thành công giao dịch với hóa đơn ${action.payload.invoiceId}`);
    }
  } catch {
    toast.error("Không thể khớp giao dịch");
  }
}

export default function* transactionsSaga() {
  yield all([
    takeLatest(getTransactionsAction.type, handleGetTransactions),
    takeLatest(reconcileTxAction.type, handleReconcileTx),
  ]);
}
