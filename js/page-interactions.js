const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const webglCanvas = document.querySelector('#webgl-container canvas');

// Si Three.js o WebGL no están disponibles, la landing sigue siendo navegable.
if (!webglCanvas) {
    document.body.classList.add('experience-ready');
    const fallbackHeader = document.querySelector('.ui.header');
    if (fallbackHeader) {
        fallbackHeader.style.opacity = '1';
        fallbackHeader.style.pointerEvents = 'auto';
    }
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
});

const notes = document.querySelector('.services .notes');

if (notes) {
    const cards = [...notes.querySelectorAll('.note')];

    const activateCard = (card) => {
        notes.dataset.active = String(cards.indexOf(card) + 1);
    };

    const deactivateCards = () => {
        delete notes.dataset.active;
    };

    cards.forEach((card) => {
        card.addEventListener('pointerenter', () => activateCard(card));
        card.addEventListener('focusin', () => activateCard(card));
    });

    notes.addEventListener('pointerleave', deactivateCards);
    notes.addEventListener('focusout', (event) => {
        if (!notes.contains(event.relatedTarget)) {
            deactivateCards();
        }
    });
}

const root = document.documentElement;
const header = document.querySelector('.ui.header');
const journey = document.querySelector('.journey');
const journeyLinks = [...document.querySelectorAll('.journey a[data-section]')];
const sections = journeyLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);
const darkSections = [document.querySelector('#nosotros'), document.querySelector('#mirar')]
    .filter(Boolean);
const hiddenHeaderSections = [document.querySelector('#mirar')].filter(Boolean);

let frameRequested = false;

const elementCrossesHeader = (element, headerCenter) => {
    const rect = element.getBoundingClientRect();
    return headerCenter >= rect.top && headerCenter <= rect.bottom;
};

const updatePageState = () => {
    const viewportHeight = window.innerHeight;
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    root.style.setProperty('--page-progress', Math.min(1, window.scrollY / scrollRange).toFixed(4));

    let activeSection = sections[0];
    let shortestDistance = Infinity;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionProgress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        section.style.setProperty('--section-progress', sectionProgress.toFixed(4));

        const distance = Math.abs(rect.top - viewportHeight * 0.38);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            activeSection = section;
        }
    });

    journeyLinks.forEach((link) => {
        const isActive = link.dataset.section === activeSection?.id;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });

    if (header) {
        const headerRect = header.getBoundingClientRect();
        const headerCenter = headerRect.top + headerRect.height / 2;
        const isLight = darkSections.some((section) => elementCrossesHeader(section, headerCenter));
        const isHidden = hiddenHeaderSections.some((section) => elementCrossesHeader(section, headerCenter));
        header.classList.toggle('header--light', isLight && !isHidden);
        header.classList.toggle('header--hidden', isHidden);
        journey?.classList.toggle('journey--light', isLight);
    }

    frameRequested = false;
};

const requestPageUpdate = () => {
    if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(updatePageState);
    }
};

window.addEventListener('scroll', requestPageUpdate, { passive: true });
window.addEventListener('resize', requestPageUpdate);
requestPageUpdate();

const lens = document.querySelector('.cursor-lens');
const lensLabel = lens?.querySelector('.cursor-lens__label');
let pointerFrame = false;
let pointerX = 0;
let pointerY = 0;

const renderPointer = () => {
    const xRatio = (pointerX / window.innerWidth) * 2 - 1;
    const yRatio = (pointerY / window.innerHeight) * 2 - 1;
    root.style.setProperty('--pointer-x', xRatio.toFixed(3));
    root.style.setProperty('--pointer-y', yRatio.toFixed(3));

    if (lens) {
        const size = lens.classList.contains('is-active') ? 86 : 58;
        lens.style.transform = `translate3d(${pointerX - size / 2}px, ${pointerY - size / 2}px, 0)`;
    }

    pointerFrame = false;
};

if (lens && finePointer.matches && !reducedMotion.matches) {
    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        document.body.classList.add('has-pointer');

        if (!pointerFrame) {
            pointerFrame = true;
            requestAnimationFrame(renderPointer);
        }
    }, { passive: true });

    document.querySelectorAll('a, button, .note').forEach((interactive) => {
        interactive.addEventListener('pointerenter', () => {
            lens.classList.add('is-active');
            if (lensLabel) lensLabel.textContent = interactive.closest('.note') ? 'ABRIR' : 'IR';
        });
        interactive.addEventListener('pointerleave', () => {
            lens.classList.remove('is-active');
            if (lensLabel) lensLabel.textContent = 'MIRAR';
        });
    });
}
