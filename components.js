// components.js - Handles loading navbar and footer

function loadNavbar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
      setupNavbarFunctionality();
    });
}

function loadFooter() {
  fetch('footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
    });
}

function setupNavbarFunctionality() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  
  if(mobileMenuToggle && navMenu && mobileOverlay) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking on overlay
    mobileOverlay.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileMenuToggle.textContent = '☰';
    });
  }

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.classList.remove('active');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.textContent = '☰';
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load components
  loadNavbar();
  loadFooter();
});