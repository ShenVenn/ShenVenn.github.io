/* Trang chi tiết: app.html?id=<id> */
(() => {
  "use strict";
  const { esc, getApp, makeIcon } = window.Store;
  const $ = (id) => document.getElementById(id);

  const id = new URLSearchParams(location.search).get("id");
  const app = getApp(id);

  if (!app) {
    document.title = "Không tìm thấy app";
    $("content").innerHTML = `<div class="not-found"><h1>Không tìm thấy app</h1>
      <p><a href="index.html">Quay về trang chủ</a></p></div>`;
    return;
  }

  document.title = `${app.fullName || app.name} - App Store`;

  // ---------- HERO ----------
  $("heroBg").style.backgroundImage = `url("${app.icon.replace(/"/g, "%22")}")`;
  $("icon").prepend(makeIcon(app.icon, app.name));
  $("appName").textContent = app.fullName || app.name;
  $("tagline").textContent = app.subtitle || app.tagline;

  const btn = $("getBtn");
  if (app.download) {
    btn.href = app.download;
    btn.rel = "noopener";
  } else {
    btn.classList.add("disabled");
    btn.textContent = "SẮP RA MẮT";
    btn.removeAttribute("href");
  }

  // ---------- INFO BAR (ô nào thiếu dữ liệu thì tự bỏ) ----------
  const box = (label, big, small) => big
    ? `<div class="info-box"><small>${esc(label)}</small><h3>${esc(big)}</h3>${small ? `<span>${esc(small)}</span>` : ""}</div>`
    : "";
  $("infoBar").innerHTML = [
    box(`${app.ratings ? app.ratings + " " : ""}RATINGS`, app.rating && `${app.rating} ★`),
    box("AGES", app.age, "Years"),
    box("CATEGORY", app.category),
    box("DEVELOPER", app.developer?.[0], app.developer?.[1]),
    box("LANGUAGE", app.language?.[0], app.language?.[1]),
    box("SIZE", app.size?.[0], app.size?.[1]),
  ].join("");

  // ---------- SCREENSHOTS ----------
  const slider = $("slider");
  const shots = app.screenshots || [];
  if (!shots.length) {
    $("shots").hidden = true;
  } else {
    slider.append(...shots.map((src, i) => makeIcon(src, `${app.name} ${i + 1}`)));
  }

  let index = 0;
  const visible = () => (window.innerWidth <= 800 ? 1 : 3);

  function updateNav() {
    const max = Math.max(0, shots.length - visible());
    index = Math.min(Math.max(index, 0), max);
    $("navLeft").style.display = index === 0 ? "none" : "flex";
    $("navRight").style.display = index >= max ? "none" : "flex";
    const first = slider.children[0];
    if (first) slider.style.transform = `translateX(-${index * (first.offsetWidth + 20)}px)`;
  }
  $("navLeft").addEventListener("click", () => { index--; updateNav(); });
  $("navRight").addEventListener("click", () => { index++; updateNav(); });
  window.addEventListener("resize", updateNav);
  updateNav();

  // ---------- MÔ TẢ (chữ thường -> tự xuống dòng + tự link hoá URL) ----------
  const text = esc(app.description || "").replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
  $("descText").innerHTML = text;
  if (!app.description) $("desc").hidden = $("divider").hidden = true;
})();
