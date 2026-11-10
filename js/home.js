/* Trang chủ: đọc window.HOME + window.APPS rồi render */
(() => {
  "use strict";
  const { esc, getApp, appUrl, makeIcon } = window.Store;
  const H = window.HOME;
  const $ = (id) => document.getElementById(id);

  // ---------- HERO + TIP ----------
  function viewBtn(appId) {
    return appId && getApp(appId)
      ? `<a class="glass-btn" href="${appUrl(appId)}">View</a>`
      : "";
  }

  function renderHero() {
    const h = H.hero;
    $("hero").innerHTML = `
      <div class="card-media">
        <img class="hero-preview" src="${esc(h.image)}" fetchpriority="high" decoding="async" alt="${esc(h.title)}">
        <video id="mainVideo" muted loop playsinline preload="none"
               data-src="${esc(h.video)}" data-type="video/mp4"></video>
      </div>
      <div class="overlay">
        <span>${esc(h.kicker)}</span>
        <h1>${esc(h.title)}</h1>
        <p>${esc(h.text)}</p>
      </div>
      <div class="bottom-bar">
        <div class="app-info" data-icon>
          <div><div class="app-name">${esc(h.appName)}</div><div class="app-type">${esc(h.appType)}</div></div>
        </div>
        ${viewBtn(h.appId)}
      </div>`;
    $("hero").querySelector("[data-icon]").prepend(makeIcon(h.appIcon, h.appName));

    // ẩn ảnh preview khi video đã sẵn sàng
    const video = $("mainVideo");
    video.addEventListener("loadeddata", () => {
      $("hero").querySelector(".hero-preview").style.display = "none";
    });
  }

  function renderTip() {
    const t = H.tip, app = getApp(t.appId);
    $("tip").innerHTML = `
      <img class="card-media-img" src="${esc(t.image)}" loading="lazy" decoding="async" alt="${esc(t.title)}"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <div class="overlay">
        <span>${esc(t.kicker)}</span>
        <h2>${esc(t.title)}</h2>
        <p>${esc(t.text)}</p>
      </div>
      <div class="bottom-bar">
        <div class="app-info" data-icon>
          <div><div class="app-name">${esc(app?.name)}</div><div class="app-type">${esc(app?.tagline)}</div></div>
        </div>
        ${viewBtn(t.appId)}
      </div>`;
    if (app) $("tip").querySelector("[data-icon]").prepend(makeIcon(app.icon, app.name));
  }

  // ---------- DANH SÁCH APP ----------
  function appItem(app) {
    const row = document.createElement("div");
    row.className = "app-item";
    row.innerHTML = `
      <div class="app-left" data-icon>
        <div>${esc(app.name)}<small>${esc(app.tagline)}</small></div>
      </div>
      <a class="glass-btn" href="${appUrl(app.id)}">View</a>`;
    row.querySelector("[data-icon]").prepend(makeIcon(app.icon, app.name));
    return row;
  }

  function renderList(boxId, ids) {
    const box = $(boxId);
    const apps = ids.map(getApp).filter(Boolean);   // id sai thì bỏ qua, không làm sập trang
    box.replaceChildren(...apps.map(appItem));
    if (!apps.length) box.innerHTML = `<div class="empty">Không có app nào.</div>`;
  }

  // ---------- TÌM KIẾM ----------
  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function onSearch(q) {
    q = norm(q.trim());
    const ids = q
      ? window.APPS.filter((a) => norm(a.name + " " + a.tagline).includes(q)).map((a) => a.id)
      : H.essentials;
    $("essKicker").textContent = q ? "Kết quả" : H.essentialsKicker;
    $("essTitle").textContent = q ? `Tìm thấy ${ids.length} app` : H.essentialsTitle;
    renderList("rightList", ids);
  }

  // ---------- INIT ----------
  document.title = "App Store";
  $("pageTitle").textContent = H.title;
  $("topKicker").textContent = H.topKicker;
  $("topTitle").textContent = H.topTitle;
  $("essKicker").textContent = H.essentialsKicker;
  $("essTitle").textContent = H.essentialsTitle;

  renderHero();
  renderTip();
  renderList("leftList", H.top);
  renderList("rightList", H.essentials);
  $("search").addEventListener("input", (e) => onSearch(e.target.value));
})();
