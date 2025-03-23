import {
  configureStore,
  /*createReducer,
    createAction,*/
  combineReducers,
} from "@reduxjs/toolkit";

import { thunk } from "redux-thunk";
import { testApi } from "../services/testApi";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: combineReducers({
    [testApi.reducerPath]: testApi.reducer,
    auth: authReducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(testApi.middleware).concat(thunk),
});
