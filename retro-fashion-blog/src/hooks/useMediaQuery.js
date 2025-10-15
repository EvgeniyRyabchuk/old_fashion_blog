import { useState, useEffect } from 'react';

// Define the breakpoint for 'mobile' vs 'desktop'
const MOBILE_BREAKPOINT_DEFAULT = '(max-width: 768px)';

export const useMediaQuery = (MOBILE_BREAKPOINT = MOBILE_BREAKPOINT_DEFAULT) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 1. Create a Media Query List (MQL)
        const mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT);

        // 2. Set initial state
        setIsMobile(mediaQueryList.matches);

        // 3. Define the change listener
        const listener = (event) => setIsMobile(event.matches);

        // 4. Attach and cleanup the listener
        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, []); // Empty dependency array ensures it runs once on mount

    return isMobile;
};