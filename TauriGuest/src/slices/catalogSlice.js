import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8001";

const initialState = {
  items: [],
  searchValue: "",
  loading: false,
  error: null,
};

export const loadCatalogHeaters = createAsyncThunk(
  "catalog/loadCatalog",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${API_BASE}/catalog_heaters`, {
        headers: { Accept: "application/json" },
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка загрузки каталога");
      }
      return data.data?.products ?? [];
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка загрузки каталога");
    }
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    resetCatalogState(state) {
      state.searchValue = "";
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalogHeaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCatalogHeaters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCatalogHeaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки каталога";
      });
  },
});

export const { setSearchValue, resetCatalogState } = catalogSlice.actions;
export const catalogReducer = catalogSlice.reducer;


