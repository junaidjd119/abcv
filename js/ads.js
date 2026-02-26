/**
 * ads.js — Centralized Google AdSense Manager
 * ============================================
 * Handles all ad logic for GymTranning.com
 *
 * Features:
 *  - Loads AdSense SDK once (reads publisher ID from /ads.txt)
 *  - Injects ONE top ad (below navbar) and ONE bottom ad (above footer)
 *  - All ads are fully responsive and lazy-loaded via IntersectionObserver
 *  - Non-intrusive: ads never block page content
 *  - Future updates: edit ONLY this file
 *
 * ⚠️  Replace SLOT IDs below with your real AdSense ad slot IDs.
 *     Publisher ID is read automatically from /ads.txt
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    // ✅ CONFIGURATION — SIRF YAHAN CHANGES KARO (Only edit here)
    // ─────────────────────────────────────────────────────────────────────────
    // PUBLISHER ID → ads.txt file mein update karo (ads.js automatic read karta hai)
    //
    // SLOT IDs kahan milenge?
    //   Google AdSense → Ads → By ad unit → Create new ad unit
    //   Har ad unit ka ek unique Slot ID hota hai (jaise: 1234567890)
    //
    //   topSlot    = Page ke TOP pe dikhne wala ad (navbar ke neeche)
    //   bottomSlot = Page ke BOTTOM pe dikhne wala ad (footer se pehle)
    // ─────────────────────────────────────────────────────────────────────────
    const AD_CONFIG = {
        topSlot: '1234567890',   // ← REPLACE: Apna TOP ad unit Slot ID yahan dalo
        bottomSlot: '0987654321',   // ← REPLACE: Apna BOTTOM ad unit Slot ID yahan dalo
        adFormat: 'auto',
        responsive: 'true'
    };

    // ─────────────────────────────────────────────
    // INTERNAL STATE
    // ─────────────────────────────────────────────
    let publisherId = null;   // resolved from ads.txt
    let sdkLoaded = false;
    let initDone = false;

    // ─────────────────────────────────────────────
    // 1. READ PUBLISHER ID FROM /ads.txt
    // ─────────────────────────────────────────────
    async function fetchPublisherId() {
        try {
            const res = await fetch('/ads.txt');
            if (!res.ok) return null;
            const text = await res.text();
            const m = text.match(/pub-(\d+)/i);
            return m ? `pub-${m[1]}` : null;
        } catch {
            return null;
        }
    }

    // ─────────────────────────────────────────────
    // 2. LOAD ADSENSE SDK (once, only if real ID)
    // ─────────────────────────────────────────────
    function loadAdSenseSdk(pubId) {
        if (sdkLoaded || document.querySelector(`script[src*="${pubId}"]`)) {
            sdkLoaded = true;
            return;
        }
        const s = document.createElement('script');
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${pubId}`;
        s.onerror = () => console.warn('[ads.js] AdSense SDK failed to load.');
        document.head.appendChild(s);
        sdkLoaded = true;
    }

    // ─────────────────────────────────────────────
    // 3. CREATE A RESPONSIVE AD CONTAINER
    // ─────────────────────────────────────────────
    function buildAdContainer(position, slotId) {
        const wrapper = document.createElement('div');
        wrapper.id = `gt-ad-${position}`;
        wrapper.className = 'gt-ad-wrapper';
        wrapper.dataset.pos = position;
        wrapper.setAttribute('aria-hidden', 'true');

        // Inline styles keep this CSS-independent
        Object.assign(wrapper.style, {
            width: '100%',
            textAlign: 'center',
            margin: position === 'top' ? '0 0 8px' : '8px 0 0',
            minHeight: '90px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            background: 'transparent',
            lineHeight: '0'
        });

        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.dataset.adClient = `ca-${publisherId}`;
        ins.dataset.adSlot = slotId;
        ins.dataset.adFormat = AD_CONFIG.adFormat;
        ins.dataset.fullWidthResponsive = AD_CONFIG.responsive;

        wrapper.appendChild(ins);
        return wrapper;
    }

    // ─────────────────────────────────────────────
    // 4. PUSH AD (lazy — only when in viewport)
    // ─────────────────────────────────────────────
    function pushAd(wrapper) {
        const ins = wrapper.querySelector('ins.adsbygoogle');
        if (!ins) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    obs.unobserve(entry.target);
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                        console.warn('[ads.js] adsbygoogle.push error:', e);
                    }
                }
            });
        }, { rootMargin: '200px', threshold: 0 });

        observer.observe(wrapper);
    }

    // ─────────────────────────────────────────────
    // 5. INJECT TOP AD — below navbar
    // ─────────────────────────────────────────────
    function injectTopAd() {
        if (document.getElementById('gt-ad-top')) return;

        const ad = buildAdContainer('top', AD_CONFIG.topSlot);

        // Find the best insertion point — right after the navbar container
        const navbar = document.getElementById('navbar-container')
            || document.getElementById('navbar-placeholder')
            || document.querySelector('.gn-navbar');

        if (navbar && navbar.parentNode) {
            navbar.parentNode.insertBefore(ad, navbar.nextSibling);
        } else {
            // Fallback: prepend to body
            document.body.insertBefore(ad, document.body.firstChild);
        }

        pushAd(ad);
    }

    // ─────────────────────────────────────────────
    // 6. INJECT BOTTOM AD — above footer
    // ─────────────────────────────────────────────
    function injectBottomAd() {
        if (document.getElementById('gt-ad-bottom')) return;

        const ad = buildAdContainer('bottom', AD_CONFIG.bottomSlot);

        const footer = document.getElementById('footer-container')
            || document.getElementById('footer-placeholder')
            || document.querySelector('.powerpulse-footer-container');

        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(ad, footer);
        } else {
            document.body.appendChild(ad);
        }

        pushAd(ad);
    }

    // ─────────────────────────────────────────────
    // 7. MAIN INIT
    // ─────────────────────────────────────────────
    async function init() {
        if (initDone) return;
        initDone = true;

        publisherId = await fetchPublisherId();

        // Don't inject ads if no valid (non-placeholder) publisher ID
        if (!publisherId || publisherId === 'pub-XXXXXXXXXXXXXXXX') {
            console.info('[ads.js] No real publisher ID found — ads skipped in dev mode.');
            return;
        }

        loadAdSenseSdk(publisherId);

        // Wait briefly for layout.js to inject navbar/footer containers
        // then inject ads. Use a MutationObserver to be precise.
        const body = document.body;

        function tryInject() {
            const hasNavbar = document.getElementById('navbar-container')
                || document.getElementById('navbar-placeholder')
                || document.querySelector('.gn-navbar');
            const hasFooter = document.getElementById('footer-container')
                || document.getElementById('footer-placeholder');

            if (hasNavbar) injectTopAd();
            if (hasFooter) injectBottomAd();

            // If both injected, disconnect observer
            if (document.getElementById('gt-ad-top') && document.getElementById('gt-ad-bottom')) {
                mo.disconnect();
            }
        }

        // Use MutationObserver to catch layout.js dynamic injection
        const mo = new MutationObserver(tryInject);
        mo.observe(body, { childList: true, subtree: true });

        // Also run immediately and on DOMContentLoaded for static layouts
        tryInject();
        document.addEventListener('DOMContentLoaded', tryInject);

        // Safety fallback: disconnect after 5 seconds
        setTimeout(() => mo.disconnect(), 5000);
    }

    // ─────────────────────────────────────────────
    // 8. BOOT
    // ─────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
