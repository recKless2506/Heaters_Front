import { Api } from "./Api";

// Базовый URL API (как в Go-сервере)
export const api = new Api({
  baseURL: "http://localhost:8001",
});


