/* ================================================
   CURSOR
================================================ */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
})();

// hover targets
document.querySelectorAll('a, button, .p-card, .cs-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// dark section cursor tint
const darkSections = document.querySelectorAll('#home, #case-studies, #contact, footer');
const onDarkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            cur.classList.add('on-dark');
            ring.classList.add('on-dark');
        } else {
            const anyDark = [...darkSections].some(s => {
                const r = s.getBoundingClientRect();
                return r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2;
            });
            if (!anyDark) {
                cur.classList.remove('on-dark');
                ring.classList.remove('on-dark');
            }
        }
    });
}, { threshold: 0.4 });
darkSections.forEach(s => onDarkObserver.observe(s));

/* ================================================
   NAV SCROLL
================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

/* ================================================
   MOBILE NAV
================================================ */
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');

function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle('open');
    ham.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    ham.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}
function closeMobileNav() {
    mobileNav.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    ham.setAttribute('aria-label', 'Open navigation menu');
}

/* ================================================
   SCROLL REVEAL (IntersectionObserver)
================================================ */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.rv, .rv-l, .rv-r').forEach(el => revealObs.observe(el));

/* ================================================
   PARALLAX
================================================ */
const parallaxBg = document.querySelector('.parallax-bg');
window.addEventListener('scroll', () => {
    if (!parallaxBg) return;
    parallaxBg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

/* ================================================
   CASE STUDY ACCORDION
================================================ */
function toggleCS(trigger) {
    const item   = trigger.closest('.cs-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.cs-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.cs-trigger')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
    }
}

document.querySelectorAll('.cs-trigger').forEach(trigger => {
    trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCS(trigger);
        }
    });
});

/* ================================================
   SMOOTH SCROLL (anchor links)
================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
});

/* ================================================
   IFRAME LOAD FALLBACKS
   Sites that block framing will show a gradient
================================================ */
document.querySelectorAll('.p-card').forEach(card => {
    const iframe   = card.querySelector('iframe');
    const fallback = card.querySelector('.p-fallback');

    const timer = setTimeout(() => {
        try {
            if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML === '') {
                fallback.classList.add('show');
            }
        } catch(err) {
            // cross-origin — iframe loaded fine, leave it alone
        }
    }, 6000);

    iframe.addEventListener('error', () => {
        clearTimeout(timer);
        fallback.classList.add('show');
    });
});
