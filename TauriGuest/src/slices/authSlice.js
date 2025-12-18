import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/index";

// Логин
export const loginUserHeaters = createAsyncThunk(
  "auth/loginUser",
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const resp = await api.login.loginCreate({
        login,
        password,
      });
      // Ожидаем структуру как в Go-бэкенде: { success, message, data: { id, login, is_moderator, token } }
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка авторизации");
      }
      const payload = data.data;
      // Сохраняем пользователя и токен в localStorage, чтобы не терять их при перезагрузке страницы
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "auth",
            JSON.stringify({
              user: {
                id: payload.id,
                login: payload.login,
                is_moderator: payload.is_moderator,
              },
              token: payload.token,
            }),
          );
        } catch {
          // игнорируем ошибки доступа к localStorage
        }
      }
      return payload;
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка авторизации");
    }
  }
);

// Регистрация
export const registerUserHeaters = createAsyncThunk(
  "auth/registerUser",
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const resp = await api.register.registerCreate({
        login,
        password,
      });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(data.message || "Ошибка регистрации");
      }
      return { login };
    } catch (e) {
      return rejectWithValue(e.message || "Ошибка регистрации");
    }
  }
);

const initialState = {
  // При перезагрузке страницы пользователь всегда считается гостем,
  // даже если JWT остался в localStorage.
  user: null, // { id, login, is_moderator }
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("auth");
        } catch {
          // игнорируем ошибки доступа к localStorage
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUserHeaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserHeaters.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          login: action.payload.login,
          is_moderator: action.payload.is_moderator,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUserHeaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка авторизации";
      })
      // register
      .addCase(registerUserHeaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserHeaters.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserHeaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка регистрации";
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;


