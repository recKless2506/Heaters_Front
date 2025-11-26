// Простая регистрация сервис-воркера для PWA, чтобы не было 404 по /registerSW.js
// Для GitHub Pages знаем, что приложение лежит в /Molodtsov_Front/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isGhPages = window.location.pathname.startsWith('/Molodtsov_Front/');
    const swPath = isGhPages ? '/Molodtsov_Front/sw.js' : '/sw.js';
    navigator.serviceWorker
      .register(swPath)
      .catch((err) => console.warn('SW register error', err));
  });
}
*** End Patch```로  !*** End Patch%    ```
json  Here  to=functions.apply_patch  assistantһында  !*** Begin Patch***)}  !*** End Patch  Looking  to=functions.apply_patch  assistant to=functions.apply_patch  hunter2  !*** Begin Patch
