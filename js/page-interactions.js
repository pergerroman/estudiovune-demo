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
    };

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);
    updateHeaderState();
}
