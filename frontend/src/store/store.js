import {
  configureStore,
  /*createReducer,
    createAction,*/
  combineReducers,
} from "@reduxjs/toolkit";

import { thunk } from "redux-thunk";
import { testApi } from "../services/testApi";

export const store = configureStore({
  reducer: combineReducers({
    [testApi.reducerPath]: testApi.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(testApi.middleware).concat(thunk),
});
