 <script>
    // Load both navbar and footer
    Promise.all([
      fetch('navbar.html').then(r => r.text()),
      fetch('footer.html').then(r => r.text())
    ])
    .then(([navbar, footer]) => {
      document.getElementById('navbar-container').innerHTML = navbar;
      document.getElementById('footer-container').innerHTML = footer;
      
      // Initialize navbar after it's loaded
      initNavbar();
    })
    .catch(error => {
      console.error('Error loading components:', error);
      // Optional: Show user-friendly error messages
      document.getElementById('navbar-container').innerHTML = '<div class="error-alert">Error loading navigation</div>';
      document.getElementById('footer-container').innerHTML = '<div class="error-alert">Error loading footer</div>';
    });
    
    function initNavbar() {
      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      const navMenu = document.getElementById('nav-menu');
      const mobileOverlay = document.getElementById('mobile-overlay');
      const navbar = document.querySelector('.navbar');
      
      if (!mobileMenuToggle || !navMenu || !mobileOverlay || !navbar) return;
      
      // Set initial state
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      
      // Toggle menu function
      const toggleMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
      };
      
      // Scroll effect for navbar
      const handleScroll = () => {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      
      // Event listeners
      mobileMenuToggle.addEventListener('click', toggleMenu);
      
      mobileOverlay.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      document.querySelectorAll('.nav-item a, .nav-item button').forEach(link => {
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
      
      // Add scroll listener
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initialize scroll state
    }
</script>
