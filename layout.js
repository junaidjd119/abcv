// Centralized Layout Loader - Navbar & Footer
(function () {
    function loadComponent(containerId, filePath, callback) {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(filePath)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to load: ' + filePath);
                return response.text();
            })
            .then(function (html) {
                container.innerHTML = html;
                // Execute any scripts inside the loaded HTML
                const scripts = container.querySelectorAll('script');
                scripts.forEach(function (oldScript) {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(function (attr) {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = oldScript.textContent;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
                if (callback) callback();
            })
            .catch(function (err) {
                console.warn('Layout component error:', err);
            });
    }

    function initNavbarScripts() {
        // Hamburger menu toggle
        const toggle = document.getElementById('gn-mobile-menu-toggle');
        const menu = document.getElementById('gn-menu');
        const overlay = document.getElementById('gn-mobile-overlay');

        if (toggle && menu && overlay) {
            toggle.addEventListener('click', function () {
                const isOpen = menu.classList.contains('active');
                menu.classList.toggle('active', !isOpen);
                overlay.classList.toggle('active', !isOpen);
                toggle.classList.toggle('active', !isOpen);
                toggle.setAttribute('aria-expanded', String(!isOpen));
            });

            overlay.addEventListener('click', function () {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        // Sticky scroll effect
        const navbar = document.querySelector('.gn-navbar');
        if (navbar) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 10) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Highlight active page link
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.gn-item a');
        links.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href && (currentPath === href || currentPath.endsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    // Load navbar
    loadComponent('navbar-container', '/navbar.html', initNavbarScripts);

    // Load footer
    loadComponent('footer-container', '/footer.html', null);
})();
