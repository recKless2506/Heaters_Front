import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authSlice";
import {
  loadDraftRequest,
  loadRequestsList,
  addProductToDraft,
  submitDraftRequest,
} from "./requestsSlice";
import { loadCatalog } from "./catalogSlice";

// Базовое состояние интерфейса:
// глобальный индикатор загрузки и текст ошибки
const initialState = {
  isGlobalLoading: false,
  globalError: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalError(state, action) {
      state.globalError = action.payload;
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
  },
  extraReducers: (builder) => {
    const start = (state) => {
      state.isGlobalLoading = true;
      state.globalError = null;
    };
    const stopOk = (state) => {
      state.isGlobalLoading = false;
    };
    const stopErr = (state, action) => {
      state.isGlobalLoading = false;
      state.globalError = action.payload ?? null;
    };

    builder
      // auth
      .addCase(loginUser.pending, start)
      .addCase(loginUser.fulfilled, stopOk)
      .addCase(loginUser.rejected, stopErr)
      .addCase(registerUser.pending, start)
      .addCase(registerUser.fulfilled, stopOk)
      .addCase(registerUser.rejected, stopErr)
      // catalog
      .addCase(loadCatalog.pending, start)
      .addCase(loadCatalog.fulfilled, stopOk)
      .addCase(loadCatalog.rejected, stopErr)
      // requests
      .addCase(loadDraftRequest.pending, start)
      .addCase(loadDraftRequest.fulfilled, stopOk)
      .addCase(loadDraftRequest.rejected, stopErr)
      .addCase(loadRequestsList.pending, start)
      .addCase(loadRequestsList.fulfilled, stopOk)
      .addCase(loadRequestsList.rejected, stopErr)
      .addCase(addProductToDraft.pending, start)
      .addCase(addProductToDraft.fulfilled, stopOk)
      .addCase(addProductToDraft.rejected, stopErr)
      .addCase(submitDraftRequest.pending, start)
      .addCase(submitDraftRequest.fulfilled, stopOk)
      .addCase(submitDraftRequest.rejected, stopErr);
  },
});

export const { setGlobalError, clearGlobalError } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;


