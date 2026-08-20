(() => {
  "use strict";

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = connection?.saveData || /(^|-)2g/.test(connection?.effectiveType || "");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Detail pages create their catalogue entries at runtime; apply safe image defaults
  // after the document has been parsed.
  document.querySelectorAll("img:not([loading])").forEach((image) => {
    image.loading = "lazy";
    image.decoding = "async";
  });

  // The homepage video has no src in markup, so it cannot start downloading until
  // we know that the visitor has not requested a lower-data/low-motion experience.
  const video = document.querySelector("video[data-src]");
  if (!video || saveData || reducedMotion) return;

  const source = document.createElement("source");
  source.src = video.dataset.src;
  source.type = video.dataset.type || "video/mp4";
  video.append(source);
  video.load();

  const playVideo = () => video.play().catch(() => {});
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      playVideo();
      observer.disconnect();
    }, { rootMargin: "200px" });
    observer.observe(video);
  } else {
    playVideo();
  }
})();
