/* Chỉ tải + chạy video trang chủ khi cần (tôn trọng Data Saver / giảm chuyển động) */
(() => {
  "use strict";
  const video = document.querySelector("video[data-src]");
  if (!video) return;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = conn?.saveData || /(^|-)2g/.test(conn?.effectiveType || "");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (saveData || reduced) return;

  const source = document.createElement("source");
  source.src = video.dataset.src;
  source.type = video.dataset.type || "video/mp4";
  video.append(source);
  video.load();

  const play = () => video.play().catch(() => {});
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      play();
      io.disconnect();
    }, { rootMargin: "200px" });
    io.observe(video);
  } else {
    play();
  }
})();
