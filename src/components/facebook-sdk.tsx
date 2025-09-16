'use client';

import Script from 'next/script';

export function FacebookSDK() {
    return (
        <>
            <div id="fb-root"></div>
            <Script
                async
                defer
                crossOrigin="anonymous"
                src="https://connect.facebook.net/en_US/sdk.js"
                onLoad={() => {
                    if (window.FB) {
                    window.FB.init({
                        appId: 'YOUR_FACEBOOK_APP_ID', // TODO: Replace with your actual App ID
                        autoLogAppEvents: true,
                        xfbml: true,
                        version: 'v19.0',
                    });
                    }
                }}
            />
        </>
    );
}
