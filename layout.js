function loadContent(containerId, url) {
  return new Promise(function (resolve) {
    var container = document.getElementById(containerId);
    if (!container) { resolve(); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (xhr.status === 200) {
        container.innerHTML = xhr.responseText;
        container.querySelectorAll('script').forEach(function (oldScript) {
          var newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(function (attr) {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        container.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }
      resolve();
    };
    xhr.onerror = function () { resolve(); };
    xhr.send();
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  await Promise.all([
    loadContent('navbar-container', '/navbar.html'),
    loadContent('footer-container', '/footer.html')
  ]);
  initNavbar();
  loadAdSenseFromAdsTxt();
});

function initNavbar() {
  const mobileMenuToggle = document.getElementById('gn-mobile-menu-toggle');
  const navMenu = document.getElementById('gn-menu');
  const mobileOverlay = document.getElementById('gn-mobile-overlay');
  const navbar = document.querySelector('.gn-navbar');

  if (!mobileMenuToggle || !navMenu || !mobileOverlay || !navbar) return;

  mobileMenuToggle.setAttribute('aria-expanded', 'false');

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  mobileMenuToggle.addEventListener('click', toggleMenu);

  mobileOverlay.addEventListener('click', () => {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  document.querySelectorAll('.gn-item a, .gn-item button').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  document.querySelectorAll('.gn-item a').forEach(link => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '');
      const isHome = (currentPath === '' || currentPath === '/') && (linkPath === '/index.html' || linkPath === '/');
      if (isHome || (linkPath && currentPath === linkPath)) {
        link.classList.add('active');
      }
    } catch (e) { /* ignore malformed hrefs */ }
  });
}

async function loadAdSenseFromAdsTxt() {
  try {
    const response = await fetch('/ads.txt');
    if (!response.ok) return;
    const text = await response.text();
    const match = text.match(/(pub-\d+)/);
    if (match && match[1]) {
      const publisherId = match[1];
      if (document.querySelector(`script[src*="client=ca-${publisherId}"]`)) return;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  } catch (err) { /* silent */ }
}
