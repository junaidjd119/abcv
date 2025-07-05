// navbar.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
    })
    .catch(err => {
      console.error('Failed to load navbar:', err);
      document.getElementById('navbar-container').innerHTML = `
        <div class="bg-red-100 p-4 text-center">
          <p class="text-red-700">Navbar failed to load</p>
        </div>`;
    });
});
