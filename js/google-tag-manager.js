(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    const firstScript = document.getElementsByTagName('script')[0];
    const tagManager = document.createElement('script');
    tagManager.async = true;
    tagManager.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MQQSHQZM';
    firstScript.parentNode.insertBefore(tagManager, firstScript);
})();
