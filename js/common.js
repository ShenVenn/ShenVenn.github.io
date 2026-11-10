/* Hàm dùng chung cho mọi trang */
(() => {
  "use strict";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const getApp = (id) => window.APPS.find((a) => a.id === id);
  const appUrl = (id) => `app.html?id=${encodeURIComponent(id)}`;

  // Tạo <img> có lazy-load + tự thay bằng ô chữ cái đầu nếu ảnh lỗi / bị chặn
  function makeIcon(src, name, className = "") {
    const img = new Image();
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = name || "";
    if (className) img.className = className;
    img.addEventListener("error", () => {
      const box = document.createElement("div");
      box.className = `icon-fallback ${className}`.trim();
      box.textContent = (name || "?").trim().charAt(0).toUpperCase();
      img.replaceWith(box);
    }, { once: true });
    img.src = src;
    return img;
  }

  window.Store = { esc, getApp, appUrl, makeIcon };
})();
