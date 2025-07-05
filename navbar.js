// navbar.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;

      // Enable mobile menu toggle
      const toggle = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('navbar-links');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('hidden');
        });
      }
    })
    .catch(err => {
      console.error('Navbar failed to load:', err);
    });
});
