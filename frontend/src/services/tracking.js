// frontend/src/services/tracking.js
const trackEvent = (event, userEmail = 'default@user.com') => {
  const data = {
    event: event.type,
    element: event.target.tagName,
    id: event.target.id,
    classList: event.target.className,
    time: new Date().toISOString(),
    userEmail, // Include user email
  };

  return fetch('/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Event tracked with ID:', data.eventId); // Log the unique event ID
    return data;
  });
};

export default trackEvent;


