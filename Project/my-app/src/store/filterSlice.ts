import { createSlice } from "@reduxjs/toolkit";

export type FilterState = {
  search: string;
};

// Берём начальное значение фильтра из localStorage (чтобы сохранялся даже после перезапуска PWA)
const initialSearch =
  typeof window !== "undefined"
    ? window.localStorage.getItem("filter_search") ?? ""
    : "";

const initialState: FilterState = {
  search: initialSearch,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: { payload: string }) {
      state.search = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("filter_search", action.payload);
      }
    },
    clearFilters(state) {
      state.search = "";
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("filter_search");
      }
    },
  },
});

export const { setSearch, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
