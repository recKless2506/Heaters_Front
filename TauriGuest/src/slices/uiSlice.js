import { createSlice } from "@reduxjs/toolkit";
import { loginUserHeaters, registerUserHeaters } from "./authSlice";
import {
  loadDraftRequestHeaters,
  loadRequestsListHeaters,
  addProductToDraftHeaters,
  submitDraftRequestHeaters,
} from "./requestsSlice";
import { loadCatalogHeaters } from "./catalogSlice";

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
      .addCase(loginUserHeaters.pending, start)
      .addCase(loginUserHeaters.fulfilled, stopOk)
      .addCase(loginUserHeaters.rejected, stopErr)
      .addCase(registerUserHeaters.pending, start)
      .addCase(registerUserHeaters.fulfilled, stopOk)
      .addCase(registerUserHeaters.rejected, stopErr)
      // catalog
      .addCase(loadCatalogHeaters.pending, start)
      .addCase(loadCatalogHeaters.fulfilled, stopOk)
      .addCase(loadCatalogHeaters.rejected, stopErr)
      // requests
      .addCase(loadDraftRequestHeaters.pending, start)
      .addCase(loadDraftRequestHeaters.fulfilled, stopOk)
      .addCase(loadDraftRequestHeaters.rejected, stopErr)
      .addCase(loadRequestsListHeaters.pending, start)
      .addCase(loadRequestsListHeaters.fulfilled, stopOk)
      .addCase(loadRequestsListHeaters.rejected, stopErr)
      // возможно, пригодится для глобального лоадера при модерации
      // .addCase(moderateRequestHeaters.pending, start)
      // .addCase(moderateRequestHeaters.fulfilled, stopOk)
      // .addCase(moderateRequestHeaters.rejected, stopErr)
      .addCase(addProductToDraftHeaters.pending, start)
      .addCase(addProductToDraftHeaters.fulfilled, stopOk)
      .addCase(addProductToDraftHeaters.rejected, stopErr)
      .addCase(submitDraftRequestHeaters.pending, start)
      .addCase(submitDraftRequestHeaters.fulfilled, stopOk)
      .addCase(submitDraftRequestHeaters.rejected, stopErr);
  },
});

export const { setGlobalError, clearGlobalError } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;


