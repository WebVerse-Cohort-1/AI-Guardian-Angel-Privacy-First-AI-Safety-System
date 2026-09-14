/**
 * Direct & High-Performance Google Sheets Integration Utility
 * Sends emergency logs / form submissions directly to Google Apps Script Web App URL
 * asynchronously without blocking the UI or causing slow page loads.
 */

// Replace with your deployed Google Apps Script Web App URL
export const DEFAULT_SHEETS_WEB_APP_URL = process.env.VITE_GOOGLE_SHEETS_URL || '';

/**
 * Asynchronously logs form or emergency data to Google Sheets
 * @param {Object} data - Form or log object to append to Google Sheet
 * @param {string} [webAppUrl] - Optional Google Apps Script deployment URL
 */
export const submitToGoogleSheets = async (data, webAppUrl = DEFAULT_SHEETS_WEB_APP_URL) => {
  if (!webAppUrl) {
    console.warn('Google Sheets Web App URL not set. Data logged locally:', data);
    return { success: true, localOnly: true };
  }

  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data,
  });

  // Try sendBeacon first for instantaneous, non-blocking background transmission
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: 'text/plain' });
      const sent = navigator.sendBeacon(webAppUrl, blob);
      if (sent) return { success: true, method: 'beacon' };
    } catch (e) {
      console.warn('sendBeacon failed, falling back to fetch', e);
    }
  }

  // Fallback to async non-blocking fetch with no-cors mode for direct Google Script posting
  try {
    fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
    }).catch(err => console.error('Background Google Sheets submit error:', err));

    return { success: true, method: 'async-fetch' };
  } catch (err) {
    console.error('Google Sheets submission failed:', err);
    return { success: false, error: err.message };
  }
};
