(() => {
    const isVercelDeployment = window.location.hostname === 'www.estudiovune.com'
        || window.location.hostname === 'estudiovune.com'
        || window.location.hostname.endsWith('.vercel.app');

    if (!isVercelDeployment) return;

    window.va = window.va || function () {
        (window.vaq = window.vaq || []).push(arguments);
    };
    window.si = window.si || function () {
        (window.siq = window.siq || []).push(arguments);
    };

    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = '/_vercel/insights/script.js';
    document.head.appendChild(analytics);

    const speedInsights = document.createElement('script');
    speedInsights.defer = true;
    speedInsights.src = '/_vercel/speed-insights/script.js';
    document.head.appendChild(speedInsights);
})();
