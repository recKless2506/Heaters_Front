import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8001";

// Базовое состояние заявок:
// - draft: черновик (корзина/текущая заявка)
// - list: список заявок пользователя
const initialState = {
  draft: null,
  list: [],
  loading: false,
  error: null,
};

// Загрузить черновик заявки (корзина)
export const loadDraftRequest = createAsyncThunk(
  "requests/loadDraftRequest",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const resp = await axios.get(`${API_BASE}/cart`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка загрузки корзины");
      }
      return data.data?.items ?? data.data?.requests ?? [];
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка загрузки корзины");
    }
  }
);

// Загрузить список заявок пользователя
export const loadRequestsList = createAsyncThunk(
  "requests/loadRequestsList",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const resp = await axios.get(`${API_BASE}/heaters_application`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка загрузки заявок");
      }
      return data.data ?? [];
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка загрузки заявок");
    }
  }
);

// Добавить товар в черновик заявки
export const addProductToDraft = createAsyncThunk(
  "requests/addProductToDraft",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axios.post(`${API_BASE}/add-to-cart/${productId}`);
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка добавления товара в заявку");
      }
      // После успешного добавления обновляем черновик
      dispatch(loadDraftRequest());
      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка добавления товара в заявку");
    }
  }
);

// Очистить корзину (отметить все черновики как удалённые)
export const clearDraft = createAsyncThunk(
  "requests/clearDraft",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axios.post(`${API_BASE}/clear-cart`, null, {
        headers: { Accept: "application/json" },
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка очистки корзины");
      }
      // После очистки перечитываем корзину
      dispatch(loadDraftRequest());
      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка очистки корзины");
    }
  }
);

// Обновить общие поля черновика (площадь и температуры)
export const updateDraftParams = createAsyncThunk(
  "requests/updateDraftParams",
  async (
    { placeSquare, outsideTemperature, insideTemperature },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const { draft } = getState().requests;
      if (!draft) {
        return rejectWithValue("Нет черновика заявки");
      }

      const items = (draft.RequestHeaters || []).map((rh) => ({
        request_id: rh.HeatersProductRequestID || draft.ID,
        product_id: rh.HeatersProductID,
        area: rh.Area ?? 0,
      }));

      const body = {
        place_square: placeSquare,
        outside_temperature: outsideTemperature,
        inside_temperature: insideTemperature,
        items,
      };

      const resp = await axios.put(`${API_BASE}/cart/update`, body, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка обновления корзины");
      }

      // Перечитываем черновик, чтобы отобразить актуальные данные
      dispatch(loadDraftRequest());
      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка обновления корзины");
    }
  },
);

// "Сформировать" текущий черновик заявки:
// вызываем защищённый эндпоинт /heaters_application/submit/:id,
// который переводит статус заявки из "черновик" в "создано"
export const submitDraftRequest = createAsyncThunk(
  "requests/submitDraftRequest",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { draft } = getState().requests;
      const { token } = getState().auth;

      if (!draft || !draft.ID) {
        return rejectWithValue("Нет черновика заявки");
      }

      const resp = await axios.put(
        `${API_BASE}/heaters_application/submit/${draft.ID}`,
        null,
        {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        },
      );

      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка формирования заявки");
      }

      // Перечитываем текущий черновик и список заявок
      await dispatch(loadDraftRequest());
      await dispatch(loadRequestsList());

      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка формирования заявки");
    }
  },
);

// Удалить товар из заявки (используется на странице заявки в статусе "черновик")
export const removeRequestItem = createAsyncThunk(
  "requests/removeRequestItem",
  async ({ requestId, productId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const { token } = getState().auth;
      const resp = await axios.delete(`${API_BASE}/heaters_application/product`, {
        data: {
          request_id: requestId,
          product_id: productId,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка при удалении товара из заявки");
      }
      // Обновляем текущий черновик и список заявок
      dispatch(loadDraftRequest());
      dispatch(loadRequestsList());
      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка при удалении товара из заявки");
    }
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    // Очистка состояния заявок (например, при выходе пользователя)
    resetRequestsState(state) {
      state.draft = null;
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadDraftRequest
      .addCase(loadDraftRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDraftRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Ожидаем, что API вернёт массив заявок-черновиков; берём первую как текущий черновик
        state.draft = action.payload[0] ?? null;
      })
      .addCase(loadDraftRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки корзины";
      })
      // loadRequestsList
      .addCase(loadRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки заявок";
      })
      // addProductToDraft
      .addCase(addProductToDraft.pending, (state) => {
        state.error = null;
      })
      .addCase(addProductToDraft.rejected, (state, action) => {
        state.error = action.payload || "Ошибка добавления товара в заявку";
      })
      // clearDraft
      .addCase(clearDraft.pending, (state) => {
        state.error = null;
      })
      .addCase(clearDraft.fulfilled, (state) => {
        state.draft = null;
      })
      // updateDraftParams
      .addCase(updateDraftParams.pending, (state) => {
        state.error = null;
      })
      .addCase(updateDraftParams.rejected, (state, action) => {
        state.error = action.payload || "Ошибка обновления корзины";
      })
      // removeRequestItem
      .addCase(removeRequestItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeRequestItem.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при удалении товара из заявки";
      })
      // submitDraftRequest
      .addCase(submitDraftRequest.pending, (state) => {
        state.error = null;
      })
      .addCase(submitDraftRequest.rejected, (state, action) => {
        state.error = action.payload || "Ошибка формирования заявки";
      });
  },
});

export const { resetRequestsState } = requestsSlice.actions;
export const requestsReducer = requestsSlice.reducer;


