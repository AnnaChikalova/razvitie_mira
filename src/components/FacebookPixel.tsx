import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/facebookPixel';

// Component to track page views on route changes in SPA
// This works with Facebook Pixel code inserted in index.html
export default function FacebookPixelTracker() {
    const location = useLocation();

    useEffect(() => {
        // Track page view when route changes (for SPA navigation)
        // This ensures Facebook Pixel tracks each page change without full page reload
        trackPageView();
    }, [location.pathname]);

    return null; // This component doesn't render anything
}

