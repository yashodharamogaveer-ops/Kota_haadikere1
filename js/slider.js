/* =========================
   SLIDER: AUTOPLAY + SWIPE
========================= */

const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
let autoSlideInterval;

/* ---------- SHOW SLIDE ---------- */
const sliderText = document.querySelector(".slider-text");

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");

  /* ---- TEXT ANIMATION RESET ---- */
  sliderText.classList.remove("animate");

  /* ---- RE-ANIMATE AFTER IMAGE CHANGE ---- */
  setTimeout(() => {
    sliderText.classList.add("animate");
  }, 300);
}


/* ---------- NEXT / PREV ---------- */
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

/* ---------- AUTOPLAY ---------- */
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000); // 4 seconds
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

/* ---------- BUTTON EVENTS ---------- */
nextBtn.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});

/* ---------- TOUCH SWIPE (MOBILE) ---------- */
let startX = 0;

const slider = document.querySelector(".slider");

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    stopAutoSlide();
    diff > 0 ? nextSlide() : prevSlide();
    startAutoSlide();
  }
});



/* ---------- INIT ---------- */
showSlide(currentIndex);
startAutoSlide();
