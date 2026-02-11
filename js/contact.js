function updateLanguage(currentLang) {
  document.querySelectorAll("[data-kn]").forEach(el => {
    el.innerHTML = el.dataset[currentLang];
  });
}

/* this assumes your main.js controls currentLang */
updateLanguage(currentLang);
