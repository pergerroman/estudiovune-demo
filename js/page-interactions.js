const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
});

const deferredBackgrounds = document.querySelectorAll('.essay');

if ('IntersectionObserver' in window) {
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-background-loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '600px 0px' });

    deferredBackgrounds.forEach((element) => backgroundObserver.observe(element));
} else {
    deferredBackgrounds.forEach((element) => element.classList.add('is-background-loaded'));
}

const sectionIndex = document.querySelector('.section-index');

if (sectionIndex) {
    const indexLinks = [...sectionIndex.querySelectorAll('.section-index__link')];
    const indexedSections = indexLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    let sectionIndexFrame = null;

    const updateSectionIndex = () => {
        const viewportMarker = window.innerHeight * 0.45;
        let activeSection = indexedSections[0];

        indexedSections.forEach((section) => {
            if (section.getBoundingClientRect().top <= viewportMarker) {
                activeSection = section;
            }
        });

        indexLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${activeSection.id}`;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        sectionIndex.classList.toggle('is-visible', activeSection.id !== 'apertura');
        sectionIndex.classList.toggle('is-on-contact', activeSection.id === 'contacto');
        sectionIndexFrame = null;
    };

    const requestSectionIndexUpdate = () => {
        if (sectionIndexFrame === null) {
            sectionIndexFrame = window.requestAnimationFrame(updateSectionIndex);
        }
    };

    window.addEventListener('scroll', requestSectionIndexUpdate, { passive: true });
    window.addEventListener('resize', requestSectionIndexUpdate);
    updateSectionIndex();
}

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

const header = document.querySelector('.ui.header');
const aboutSection = document.querySelector('#nosotros');
const essaySection = document.querySelector('.essay');

if (header && aboutSection) {
    const updateHeaderState = () => {
        const headerRect = header.getBoundingClientRect();
        const aboutRect = aboutSection.getBoundingClientRect();
        const headerCenter = headerRect.top + (headerRect.height / 2);
        const isOverAbout = headerCenter >= aboutRect.top
            && headerCenter <= aboutRect.bottom;
        const essayRect = essaySection?.getBoundingClientRect();
        const isOverEssay = essayRect
            ? headerCenter >= essayRect.top && headerCenter <= essayRect.bottom
            : false;

        header.classList.toggle('header--light', isOverAbout && !isOverEssay);
        header.classList.toggle('header--hidden', isOverEssay);

        const navigationReady = header.dataset.navigationReady === 'true';
        const available = navigationReady && !isOverEssay;
        header.toggleAttribute('inert', !available);
        header.setAttribute('aria-hidden', String(!available));
        header.style.visibility = available ? 'visible' : 'hidden';
    };

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);
    updateHeaderState();
}
