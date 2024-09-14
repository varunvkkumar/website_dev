// frontend/src/services/tracking.js
const trackEvent = (data, userEmail = 'default@user.com') => {
  return fetch('/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trackingId: data.trackingId,
      userEmail: userEmail
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Event tracked with ID:', data.eventId); // Log the unique event ID
    return data;
  });
};

export default trackEvent;



