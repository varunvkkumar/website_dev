// src/utils/analytics.js
export const pushToDataLayer = (event, data = {}) => {
    if (window && window.dataLayer) {
        window.dataLayer.push({ event, ...data });
    } else {
        console.warn('Data Layer is not defined.');
    }
};