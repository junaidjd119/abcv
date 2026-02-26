/**
 * Centralized Layout Loader
 * Handles dynamic injection of Navbar and Footer across all pages.
 * Also initializes mobile menu functionality and scroll effects.
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Layout Loader: DOMContentLoaded. Initializing...");
  loadLayout();
});

/**
 * Fetches and injects navbar and footer HTML.
 * Targets both *-placeholder and *-container IDs for compatibility.
 */
async function loadLayout() {
  const cacheBuster = `?v=${new Date().getTime()}`;
  console.log("Layout Loader: Fetching components...");

  try {
    // Use absolute paths to ensure components are fetched from the root regardless of current page depth
    const [navbarHTML, footerHTML] = await Promise.all([
      fetch("/navbar.html" + cacheBuster).then(r => {
        if (!r.ok) {
          // Fallback for local file testing if absolute path fails
          return fetch("navbar.html" + cacheBuster).then(r2 => {
            if (!r2.ok) throw new Error(`Navbar fetch failed: ${r.status}`);
            return r2.text();
          });
        }
        return r.text();
      }),
      fetch("/footer.html" + cacheBuster).then(r => {
        if (!r.ok) {
          // Fallback for local file testing if absolute path fails
          return fetch("footer.html" + cacheBuster).then(r2 => {
            if (!r2.ok) throw new Error(`Footer fetch failed: ${r.status}`);
            return r2.text();
          });
        }
        return r.text();
      })
    ]);

    console.log("Layout Loader: Components fetched successfully.");

    const navbarContainers = ["navbar-placeholder", "navbar-container"];
    const footerContainers = ["footer-placeholder", "footer-container"];

    let navbarTarget = null;
    for (const id of navbarContainers) {
      navbarTarget = document.getElementById(id);
      if (navbarTarget) {
        console.log(`Layout Loader: Navbar target found: #${id}`);
        break;
      }
    }

    let footerTarget = null;
    for (const id of footerContainers) {
      footerTarget = document.getElementById(id);
      if (footerTarget) {
        console.log(`Layout Loader: Footer target found: #${id}`);
        break;
      }
    }

    if (navbarTarget) {
      navbarTarget.innerHTML = navbarHTML;
    } else {
      console.warn("Layout Loader: Navbar target NOT found on this page.");
    }

    if (footerTarget) {
      footerTarget.innerHTML = footerHTML;
    } else {
      console.warn("Layout Loader: Footer target NOT found on this page.");
    }

    // Initialize navbar interactions
    // Use a small timeout to ensure the DOM has fully processed the innerHTML
    setTimeout(initNavbar, 50);

  } catch (err) {
    console.error("Layout Loader CRITICAL ERROR:", err);
  }
}

/**
 * Initializes mobile menu interactions, animations, and navbar scroll effects.
 */
function initNavbar() {
  console.log("Navbar Init: Starting...");

  const mobileMenuToggle = document.getElementById('gn-mobile-menu-toggle');
  const navMenu = document.getElementById('gn-menu');
  const mobileOverlay = document.getElementById('gn-mobile-overlay');
  const navbar = document.querySelector('.gn-navbar');

  if (!mobileMenuToggle) console.error("Navbar Init failure: #gn-mobile-menu-toggle not found.");
  if (!navMenu) console.error("Navbar Init failure: #gn-menu not found.");
  if (!mobileOverlay) console.error("Navbar Init failure: #gn-mobile-overlay not found.");
  if (!navbar) console.error("Navbar Init failure: .gn-navbar class not found.");

  if (!mobileMenuToggle || !navMenu || !mobileOverlay || !navbar) {
    console.log("Navbar Init: Aborting due to missing elements.");
    return;
  }

  console.log("Navbar Init: All elements found. Attaching listeners.");

  // Set initial accessibility state
  mobileMenuToggle.setAttribute('aria-expanded', 'false');

  /**
   * Toggles the mobile menu state
   */
  const toggleMenu = (e) => {
    if (e) e.preventDefault();
    console.log("Navbar: Toggle menu triggered.");

    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');

    // Prevent body scrolling when menu is in full-screen overlay mode
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  /**
   * Adds shadow effect to navbar when page is scrolled
   */
  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Attach menu toggle listener
  mobileMenuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking on overlay
  mobileOverlay.addEventListener('click', () => {
    console.log("Navbar: Overlay click. Closing menu.");
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close menu when clicking on navigation links
  document.querySelectorAll('.gn-item a, .gn-item button').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        console.log("Navbar: Link click. Closing menu.");
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Attach scroll listener
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // -------------------------------------------------------
  // Active link detection — match current page to nav link
  // -------------------------------------------------------
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

  console.log("Navbar Init: Completed successfully.");
}

/**
 * Dynamic AdSense Loader
 * Fetches ads.txt, extracts the Publisher ID, and injects the AdSense script.
 * This allows the user to manage the ID centrally from ads.txt.
 */
async function loadAdSenseFromAdsTxt() {
  console.log("AdSense Loader: initializing...");
  try {
    const response = await fetch('/ads.txt');
    if (!response.ok) {
      console.warn(`AdSense Loader: Failed to fetch ads.txt: status ${response.status}`);
      return;
    }
    const text = await response.text();

    // Look for pattern: pub-XXXXXXXXXXXXXXXX
    const match = text.match(/(pub-\d+)/);

    if (match && match[1]) {
      const publisherId = match[1];
      console.log(`AdSense Loader: Found Publisher ID ${publisherId}`);

      // Check if script is already present to avoid duplicates
      if (document.querySelector(`script[src*="client=ca-${publisherId}"]`)) {
        console.log("AdSense Loader: Script already present. Skipping injection.");
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      console.log(`AdSense Loader: Script injected successfully for ${publisherId}`);
    } else {
      console.warn("AdSense Loader: No valid Publisher ID (pub-XXXXXXXXXXXXXXXX) found in ads.txt");
    }
  } catch (err) {
    console.error("AdSense Loader: Error loading ads.txt", err);
  }
}

// Initialize AdSense Loader
document.addEventListener("DOMContentLoaded", loadAdSenseFromAdsTxt);
