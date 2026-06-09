const nav = document.getElementById('nav');
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const vaultScreen = document.getElementById('vaultScreen');
const vaultFile = document.getElementById('vaultFile');
const vaultPanel = document.getElementById('vaultPanel');
const vaultForm = document.getElementById('vaultForm');
const vaultInput = document.getElementById('vaultInput');
const vaultMessage = document.getElementById('vaultMessage');
const vaultSkipLink = document.getElementById('vaultSkipLink');
const vaultRevealPasscode = document.getElementById('vaultRevealPasscode');
const archiveScreen = document.getElementById('archiveScreen');
const archiveFolders = document.querySelectorAll('.archive-folder');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const portfolioPasscode = 'AILEEN';
const showClosetDirectly = new URLSearchParams(window.location.search).get('closet') === '1';

if (vaultScreen) {
    document.body.classList.add('is-locked');
}

if (showClosetDirectly && vaultScreen && archiveScreen) {
    document.body.classList.remove('is-locked');
    vaultScreen.hidden = true;
    archiveScreen.hidden = false;
}

if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

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

ham?.addEventListener('click', toggleMobileNav);
mobileNavLinks.forEach((link) => link.addEventListener('click', closeMobileNav));

function openVaultPanel() {
    if (!vaultPanel || !vaultFile) {
        return;
    }

    vaultPanel.hidden = false;
    requestAnimationFrame(() => {
        vaultPanel.classList.add('is-visible');
        vaultFile.classList.add('is-active');
        vaultFile.setAttribute('aria-expanded', 'true');
        vaultInput?.focus();
    });
}

function enterPortfolio() {
    if (!vaultScreen || !archiveScreen) {
        window.location.href = 'index.html?closet=1';
        return;
    }

    document.body.classList.remove('is-locked');
    vaultScreen.hidden = true;
    archiveScreen.hidden = false;
    window.history.replaceState({}, '', 'index.html?closet=1');
}

function unlockPortfolio() {
    if (!vaultScreen || !archiveScreen) {
        return;
    }

    document.body.classList.remove('is-locked');
    vaultMessage?.classList.remove('is-error');
    vaultMessage?.classList.add('is-success');
    if (vaultMessage) {
        vaultMessage.textContent = 'Passcode worked. Opening the closet now.';
    }

    vaultScreen.classList.add('is-unlocked');

    window.setTimeout(() => {
        vaultScreen.hidden = true;
        archiveScreen.hidden = false;
    }, reduceMotion ? 0 : 850);
}

function skipToCloset(event) {
    event?.preventDefault();

    if (!vaultScreen || !archiveScreen) {
        window.location.href = 'index.html?closet=1';
        return;
    }

    document.body.classList.remove('is-locked');
    vaultScreen.hidden = true;
    archiveScreen.hidden = false;
    window.history.replaceState({}, '', 'index.html?closet=1');
}

function openArchiveTarget(path) {
    if (!archiveScreen || !path) {
        return;
    }

    archiveScreen.classList.add('is-hidden');

    window.setTimeout(() => {
        window.location.href = path;
    }, reduceMotion ? 0 : 700);
}

vaultFile?.addEventListener('click', enterPortfolio);
vaultRevealPasscode?.addEventListener('click', openVaultPanel);
vaultSkipLink?.addEventListener('click', skipToCloset);

vaultForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitted = vaultInput?.value.trim().toUpperCase() ?? '';

    if (submitted === portfolioPasscode) {
        unlockPortfolio();
        return;
    }

    if (vaultMessage) {
        vaultMessage.textContent = 'That is not it. Try Aileen\'s first name.';
        vaultMessage.classList.remove('is-success');
        vaultMessage.classList.add('is-error');
    }

    vaultInput?.select();
});

archiveFolders.forEach((folder) => {
    folder.addEventListener('click', (event) => {
        const path = folder.getAttribute('href');
        if (path) {
            event.preventDefault();
            openArchiveTarget(path);
        }
    });
});

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
