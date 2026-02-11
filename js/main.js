/* ===============================
   LANGUAGE SYSTEM
================================ */

let currentLang = "kn";

function updateLanguage() {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.dataset[currentLang];
  });

  const label = currentLang === "en" ? "ಕನ್ನಡ" : "English";
  const desktopBtn = document.getElementById("langToggle");
  const mobileBtn = document.getElementById("mobileLangToggle");

  if (desktopBtn) desktopBtn.textContent = label;
  if (mobileBtn) mobileBtn.textContent = label;

  // Optional Seva tables
  const sevaKn = document.querySelector(".seva-kn");
  const sevaEn = document.querySelector(".seva-en");

  if (sevaKn && sevaEn) {
    sevaKn.style.display = currentLang === "en" ? "none" : "table";
    sevaEn.style.display = currentLang === "en" ? "table" : "none";
  }
}

/* Toggle buttons */
document.getElementById("langToggle")?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "kn" : "en";
  updateLanguage();
});

document.getElementById("mobileLangToggle")?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "kn" : "en";
  updateLanguage();
});

/* ===============================
   MOBILE MENU
================================ */

document.getElementById("hamburger")?.addEventListener("click", () => {
  document.getElementById("mobileMenu")?.classList.toggle("show");
});

/* ===============================
   SLIDER (if exists)
================================ */
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

if (slides.length) {
  let index = 0;

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d?.classList.toggle("active", idx === i));
    index = i;
  }

  document.querySelector(".next")?.addEventListener("click", () =>
    showSlide((index + 1) % slides.length)
  );

  document.querySelector(".prev")?.addEventListener("click", () =>
    showSlide((index - 1 + slides.length) % slides.length)
  );

  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  setInterval(() => showSlide((index + 1) % slides.length), 6000);
}

/* ===============================
   ABOUT SECTION ANIMATION
================================ */
const aboutSection = document.querySelector("#about");
if (aboutSection) {
  const aboutText = aboutSection.querySelector(".about-text");
  const aboutImage = aboutSection.querySelector(".about-image");

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      aboutText?.classList.add("active");
      aboutImage?.classList.add("active");
    }
  }, { threshold: 0.3 }).observe(aboutSection);
}

/* ===============================
   GALLERY ANIMATION
================================ */
const gallery = document.querySelector(".gallery-container");
if (gallery) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) gallery.classList.add("active");
  }, { threshold: 0.2 }).observe(gallery);
}

/* ===============================
   BACK TO TOP
================================ */
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ===============================
   GALLERY LIGHTBOX
================================ */
const galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

if (lightbox && lightboxImg && lightboxClose && lightboxPrev && lightboxNext && lightboxCaption && galleryImages.length) {
  let currentIndex = 0;
  let startX = 0, endX = 0;
  let isZoomed = false;
  let lastTapTime = 0;

  function openLightbox(index) {
    resetZoom();
    const img = galleryImages[index];
    currentIndex = index;
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.closest("figure")?.querySelector("figcaption")?.textContent || "";
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
  }

  function resetZoom() {
    lightboxImg.classList.remove("zoomed");
    lightboxImg.style.transformOrigin = "center center";
    isZoomed = false;
  }

  function toggleZoom(e) {
    if (!isZoomed) {
      const touch = e.changedTouches[0];
      const rect = lightboxImg.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      lightboxImg.style.transformOrigin = `${x}% ${y}%`;
      lightboxImg.classList.add("zoomed");
      isZoomed = true;
    } else {
      lightboxImg.classList.remove("zoomed");
      lightboxImg.style.transformOrigin = "center center";
      isZoomed = false;
    }
  }

  galleryImages.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", showNext);
  lightboxPrev.addEventListener("click", showPrev);

  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  /* Swipe Support */
  lightbox.addEventListener("touchstart", e => { startX = e.touches[0].clientX; if(isZoomed) e.stopPropagation(); });
  lightbox.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    if (!isZoomed) {
      const diff = startX - endX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) showNext();
      else showPrev();
    }
  });
  lightbox.addEventListener("touchmove", e => { if(isZoomed) e.preventDefault(); });

  /* Double Tap Zoom */
  lightboxImg.addEventListener("touchend", e => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 300 && tapLength > 0) { e.preventDefault(); toggleZoom(e); }
    lastTapTime = currentTime;
  });

  /* Reset zoom on close */
  lightboxClose.addEventListener("click", resetZoom);
  window.addEventListener("orientationchange", () => setTimeout(resetZoom, 300));
}

/* ===============================
   INIT
================================ */
updateLanguage();
