const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

document.querySelectorAll(".gallery-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    lightboxImage.src = tile.dataset.image;
    lightboxImage.alt = tile.querySelector("img").alt;
    lightboxCaption.textContent = tile.dataset.caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const closeLightbox = () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
};

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get("name");
  const message = document.querySelector("#form-message");
  message.textContent = `Thank you, ${name}. We saved your RSVP with a little extra joy.`;
  event.currentTarget.reset();
});

document.addEventListener("pointermove", (event) => {
  document.querySelector(".cursor-glow").style.left = `${event.clientX}px`;
  document.querySelector(".cursor-glow").style.top = `${event.clientY}px`;
});

const scratchCard = document.querySelector("#scratch-card");
const scratchCanvas = document.querySelector("#scratch-canvas");
const scratchContext = scratchCanvas.getContext("2d");
const sparkleContainer = document.querySelector(".sparkles");
let isScratching = false;
let scratchedPixels = 0;
let lastPoint = null;

const paintScratchSurface = () => {
  const bounds = scratchCard.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  scratchCanvas.width = bounds.width * scale;
  scratchCanvas.height = bounds.height * scale;
  scratchCanvas.style.width = `${bounds.width}px`;
  scratchCanvas.style.height = `${bounds.height}px`;
  scratchContext.scale(scale, scale);
  const gradient = scratchContext.createLinearGradient(0, 0, bounds.width, bounds.height);
  gradient.addColorStop(0, "#c99b5d");
  gradient.addColorStop(0.5, "#9d7042");
  gradient.addColorStop(1, "#d6ab70");
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, bounds.width, bounds.height);
  scratchContext.fillStyle = "rgba(255, 245, 222, .2)";
  for (let index = 0; index < 45; index += 1) {
    scratchContext.beginPath();
    scratchContext.arc(Math.random() * bounds.width, Math.random() * bounds.height, 1.5, 0, Math.PI * 2);
    scratchContext.fill();
  }
};

const scratchAt = (event) => {
  if (!isScratching) return;
  const bounds = scratchCanvas.getBoundingClientRect();
  const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.lineWidth = 34;
  scratchContext.lineCap = "round";
  scratchContext.lineJoin = "round";
  scratchContext.beginPath();
  if (lastPoint) {
    scratchContext.moveTo(lastPoint.x, lastPoint.y);
  } else {
    scratchContext.moveTo(point.x, point.y);
  }
  scratchContext.lineTo(point.x, point.y);
  scratchContext.stroke();
  lastPoint = point;
  scratchedPixels += 1;
  if (scratchedPixels > 55) {
    scratchCard.classList.add("revealed");
    scratchCanvas.style.pointerEvents = "none";
    createSparkles();
  }
};

const createSparkles = () => {
  if (scratchCard.classList.contains("sparkled")) return;
  scratchCard.classList.add("sparkled");
  for (let index = 0; index < 18; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = index % 3 === 0 ? "✦" : "·";
    sparkle.style.setProperty("--x", `${12 + Math.random() * 76}%`);
    sparkle.style.setProperty("--y", `${12 + Math.random() * 76}%`);
    sparkle.style.setProperty("--delay", `${Math.random() * 180}ms`);
    sparkleContainer.appendChild(sparkle);
  }
};

scratchCanvas.addEventListener("pointerdown", (event) => {
  isScratching = true;
  lastPoint = null;
  scratchCanvas.setPointerCapture(event.pointerId);
  scratchAt(event);
});
scratchCanvas.addEventListener("pointermove", scratchAt);
scratchCanvas.addEventListener("pointerup", () => {
  isScratching = false;
  lastPoint = null;
});
scratchCanvas.addEventListener("pointercancel", () => {
  isScratching = false;
  lastPoint = null;
});
paintScratchSurface();
window.addEventListener("resize", paintScratchSurface);
