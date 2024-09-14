// container.js
(function (window, document) {
    // Initialize the dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Function to load tags from the server
    const loadTags = async () => {
        try {
            const response = await fetch('/api/tags'); // Fetch tags from your server
            const tags = await response.json();

            // Inject each tag into the page
            tags.forEach((tag) => {
                if (tag.type === 'script') {
                    const script = document.createElement('script');
                    script.src = tag.src;
                    document.head.appendChild(script);
                } else if (tag.type === 'html') {
                    const div = document.createElement('div');
                    div.innerHTML = tag.content;
                    document.body.appendChild(div);
                }
            });
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    // Load the tags
    loadTags();

    // Listen for dataLayer pushes
    window.addEventListener('dataLayerPush', (event) => {
        const eventData = event.detail;
        console.log('Data Layer Event:', eventData);

        // Example logic to trigger tags based on data layer events
        if (eventData.event === 'page_view') {
            // Trigger specific tags or actions here
            console.log('Page view detected, firing tags...');
        }
    });
})(window, document);

