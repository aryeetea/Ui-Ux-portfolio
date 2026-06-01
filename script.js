const nav = document.getElementById('nav');
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

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

ham.addEventListener('click', toggleMobileNav);
mobileNavLinks.forEach((link) => link.addEventListener('click', closeMobileNav));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
        }
    });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv, .rv-l, .rv-r').forEach((element) => {
    revealObserver.observe(element);
});

function toggleCaseStudy(trigger) {
    const item = trigger.closest('.cs-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.cs-item').forEach((entry) => {
        entry.classList.remove('open');
        entry.querySelector('.cs-trigger')?.setAttribute('aria-expanded', 'false');
        entry.querySelector('.cs-panel')?.setAttribute('aria-hidden', 'true');
    });

    if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        item.querySelector('.cs-panel')?.setAttribute('aria-hidden', 'false');
    }
}

document.querySelectorAll('.cs-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => toggleCaseStudy(trigger));
});

document.querySelectorAll('.cs-item').forEach((item) => {
    const panel = item.querySelector('.cs-panel');
    panel?.setAttribute('aria-hidden', item.classList.contains('open') ? 'false' : 'true');
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMobileNav();
    }
});

[
    ['heroImg', 'heroFallback'],
    ['aboutImg', 'aboutFallback']
].forEach(([imgId, fallbackId]) => {
    const image = document.getElementById(imgId);
    const fallback = document.getElementById(fallbackId);

    if (!image || !fallback) {
        return;
    }

    image.addEventListener('error', () => {
        image.hidden = true;
        fallback.hidden = false;
    });
});

document.querySelectorAll('.project-card').forEach((card) => {
    const iframe = card.querySelector('iframe');
    const fallback = card.querySelector('.project-fallback');

    const timer = window.setTimeout(() => {
        try {
            if (!iframe?.contentDocument || iframe.contentDocument.body.innerHTML === '') {
                fallback?.classList.add('show');
            }
        } catch (error) {
            // Cross-origin access means the preview likely loaded fine.
        }
    }, 6000);

    iframe?.addEventListener('error', () => {
        window.clearTimeout(timer);
        fallback?.classList.add('show');
    });
});
