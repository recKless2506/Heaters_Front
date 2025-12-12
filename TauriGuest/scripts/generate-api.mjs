import { resolve } from "path";
import { generateApi } from "swagger-typescript-api";

// Генерируем клиент прямо с работающего Go-бэка
generateApi({
  name: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  url: "http://localhost:8001/swagger/doc.json", // путь до swagger JSON
  httpClientType: "axios",
  generateClient: true,
})
  .then(() => {
    console.log("API client generated from swagger (HTTP URL)");
  })
  .catch((err) => {
    console.error("Failed to generate API client", err);
    process.exit(1);
  });


