document.addEventListener("DOMContentLoaded", function () {

  Promise.all([
    fetch("navbar.html").then(r => r.text()),
    fetch("footer.html").then(r => r.text())
  ])
  .then(([navbarHTML, footerHTML]) => {
    const navbarContainer = document.getElementById("navbar-placeholder");
    const footerContainer = document.getElementById("footer-placeholder");

    if (navbarContainer) navbarContainer.innerHTML = navbarHTML;
    if (footerContainer) footerContainer.innerHTML = footerHTML;

    initNavbar(); // Mobile menu logic
  })
  .catch(err => console.error("Error loading navbar/footer:", err));

});

function initNavbar() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("nav-menu");
  const overlay = document.getElementById("mobile-overlay");

  if (!toggle || !menu || !overlay) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("d-none");
    overlay.classList.toggle("d-none");
  });

  overlay.addEventListener("click", () => {
    menu.classList.add("d-none");
    overlay.classList.add("d-none");
  });
}
