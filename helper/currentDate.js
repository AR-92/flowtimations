/**
 * Get the current date in various formats.
 * 
 * @param {Object} options - Options to customize the date format.
 * @param {boolean} [options.iso=true] - Return date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @param {boolean} [options.utc=false] - Return date in UTC format (YYYY-MM-DD HH:mm:ss UTC).
 * @param {boolean} [options.timestamp=false] - Return Unix timestamp (milliseconds since epoch).
 * @param {boolean} [options.locale=false] - Return a locale-based date string.
 * @param {string} [options.localeString='en-US'] - Locale string for formatting (default: 'en-US').
 * @returns {string|number} - The formatted date string or timestamp.
 */
function getCurrentDate(options = {}) {
  const {
    iso = true,
    utc = false,
    timestamp = false,
    locale = false,
    localeString = 'en-US'
  } = options;

  const now = new Date();

  if (timestamp) return now.getTime();
  if (utc) return now.toUTCString();
  if (locale) return now.toLocaleString(localeString);
  if (iso) return now.toISOString();

  return now.toString(); // Default to full string format if no option is selected
}

// Example Usage:
//console.log(getCurrentDate({ iso: true }));      // 2025-02-20T12:34:56.789Z
//console.log(getCurrentDate({ utc: true }));      // Thu, 20 Feb 2025 12:34:56 GMT
//console.log(getCurrentDate({ timestamp: true })); // 1745338496789
//console.log(getCurrentDate({ locale: true, localeString: 'fr-FR' })); // 20/02/2025, 13:34:56


module.exports = getCurrentDate;

