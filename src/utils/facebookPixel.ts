// Facebook Pixel utility functions

interface FacebookPixel {
    (...args: any[]): void;
    q?: any[];
    l?: number;
}

declare global {
    interface Window {
        fbq?: FacebookPixel;
        _fbq?: any;
    }
}

// Initialize Facebook Pixel
export const initFacebookPixel = (pixelId: string) => {
    if (typeof window === 'undefined') return;

    // Check if already initialized (fbq is optional, so check for existence)
    if (window.fbq) return;

    // Initialize pixel
    const fbq = function (...args: any[]) {
        (fbq.q = fbq.q || []).push(args);
    } as FacebookPixel;
    fbq.q = [];
    fbq.l = +new Date();
    window.fbq = fbq;

    // Load the pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://connect.facebook.net/en_US/fbevents.js`;
    document.head.appendChild(script);

    // Initialize with pixel ID
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
};

// Track page view (for SPA navigation)
export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
};

// Track custom events
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
        if (eventData) {
            window.fbq('track', eventName, eventData);
        } else {
            window.fbq('track', eventName);
        }
    }
};

// Track conversions (e.g., Purchase, Lead, etc.)
export const trackConversion = (eventName: string, value?: number, currency?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        const params: any = {};
        if (value) params.value = value;
        if (currency) params.currency = currency;

        if (Object.keys(params).length > 0) {
            window.fbq('track', eventName, params);
        } else {
            window.fbq('track', eventName);
        }
    }
};



