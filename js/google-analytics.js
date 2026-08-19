window.dataLayer = window.dataLayer || [];

function gtag() {
    window.dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-Y0DP1ZTWEZ');

document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    if (link.classList.contains('note__more')) {
        const serviceName = link.closest('.note')?.querySelector('h3')?.textContent.trim();
        gtag('event', 'service_click', {
            service_name: serviceName || 'Servicio sin identificar',
            cta_location: 'services'
        });
        return;
    }

    if (link.classList.contains('btn--cyan')) {
        gtag('event', 'hero_cta_click', {
            cta_location: 'hero'
        });
        return;
    }

    if (link.href.startsWith('https://wa.me/')) {
        gtag('event', 'whatsapp_click', {
            contact_location: link.classList.contains('foot__button')
                ? 'footer_cta'
                : 'footer_contact'
        });
        return;
    }

    if (link.href.startsWith('mailto:')) {
        gtag('event', 'email_click', {
            contact_location: 'footer_contact'
        });
    }
});
