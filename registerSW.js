// Простая регистрация сервис-воркера для PWA, чтобы не было 404 по /registerSW.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${window.location.pathname.replace(/\/$/, '')}/sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .catch((err) => console.warn('SW register error', err));
  });
}


