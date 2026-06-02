const nav = document.getElementById('nav');
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
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

if (!reduceMotion && cursor && cursorRing && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateRing);
    };

    animateRing();

    document.querySelectorAll('a, button, .project-card, .cs-item, .mini-card, .about-grid article').forEach((element) => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorRing.classList.add('hovered');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorRing.classList.remove('hovered');
        });
    });
}

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

document.querySelectorAll('.profile-photo').forEach((image) => {
    const fallback = document.getElementById('heroFallback');

    image.addEventListener('error', () => {
        image.hidden = true;
        if (fallback) {
            fallback.hidden = false;
        }
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

if (!reduceMotion) {
    const parallaxElements = document.querySelectorAll('.page-glow, .portrait-card');
    let ticking = false;

    const updateParallax = () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach((element, index) => {
            const speed = 0.03 + index * 0.02;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}
