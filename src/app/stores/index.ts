import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authSlice } from "./reducers/auth";
import { cashflowSlice } from "./reducers/cashflow";
import { transactionsSlice } from "./reducers/transactions";
import { integrationsSlice } from "./reducers/integrations";
import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cashflow: cashflowSlice.reducer,
    transactions: transactionsSlice.reducer,
    integrations: integrationsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
