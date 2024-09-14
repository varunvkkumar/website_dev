// container.js
(function (window, document) {
    console.log('Initializing container.js');

    // Initialize the dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Function to load tags from the server
    const loadTags = async () => {
        try {
            console.log('Fetching tags from /api/tags');
            const response = await fetch('/api/tags');
            const tags = await response.json();
            console.log('Tags fetched:', tags);

            // Inject each tag into the page
            tags.forEach((tag) => {
                if (tag.type === 'script') {
                    const script = document.createElement('script');
                    script.src = tag.src;
                    script.async = true;
                    document.head.appendChild(script);
                    console.log('Injected script tag:', tag.src);
                } else if (tag.type === 'html') {
                    const div = document.createElement('div');
                    div.innerHTML = tag.content;
                    document.body.appendChild(div);
                    console.log('Injected HTML tag:', tag.content);
                }
            });
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    // Load the tags
    loadTags();

    // Listen for dataLayer pushes
    window.addEventListener('dataLayerPush', async (event) => {
        const eventData = event.detail;
        console.log('Data Layer Event received in container.js:', eventData);

        // Handle different events
        switch (eventData.event) {
            case 'women_link_click':
                // Example: Call /track API for 'women_link_click'
                await handleTrackingEvent(eventData);
                break;

            case 'men_link_click':
                // Example: Call /track API for 'men_link_click'
                await handleTrackingEvent(eventData);
                break;

            // Add cases for other events you want to track
            default:
                console.log('Unhandled event:', eventData.event);
        }
    });

    // Function to handle tracking events
    const handleTrackingEvent = async (eventData) => {
        try {
            const response = await fetch('/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackingId: eventData.event, userEmail: eventData.userEmail }),
            });

            const result = await response.json();
            console.log('Track API response:', result);

            if (result.showCoupon) {
                // Dispatch the custom event to show the coupon modal
                const customEvent = new CustomEvent('showCouponModal', {
                    detail: { message: 'You have received an exclusive discount coupon!' }
                });
                window.dispatchEvent(customEvent);
            }
        } catch (error) {
            console.error('Error in tracking event:', error);
        }
    };

    // Listen for custom event to show the coupon modal
    window.addEventListener('showCouponModal', (event) => {
        const eventData = event.detail;
        console.log('Showing coupon modal:', eventData.message);

        // Trigger the callback function to show the modal
        if (window.showCouponModal) {
            window.showCouponModal(eventData.message);
        }
    });
})(window, document);





