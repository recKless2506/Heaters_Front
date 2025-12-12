import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../slices/authSlice";
import { requestsReducer } from "../slices/requestsSlice";
import { uiReducer } from "../slices/uiSlice";
import { catalogReducer } from "../slices/catalogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    ui: uiReducer,
    catalog: catalogReducer,
  },
});


