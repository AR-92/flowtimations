const { request } = require('https'); // Use 'http' for non-HTTPS requests
const { URL } = require('url');

/**
 * Makes an API request using native Node.js modules.
 * 
 * @param {string} url - The API endpoint.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {object} [data={}] - The request body (for POST, PUT, PATCH requests).
 * @param {object} [params={}] - The query parameters.
 * @param {object} [headers={}] - Additional headers.
 * @returns {Promise<object>} - The API response.
 * 
 * @example
 * // Making a GET request
 * makeApiRequest('https://jsonplaceholder.typicode.com/posts/1', 'GET')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * 
 * @example
 * // Making a POST request with data
 * makeApiRequest('https://jsonplaceholder.typicode.com/posts', 'POST', 
 *   { title: 'foo', body: 'bar', userId: 1 })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
function makeApiRequest(url, method, data = {}, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        try {
            // Construct the URL with query parameters
            const urlObj = new URL(url);
            Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));

            // Convert data to JSON if not empty
            const body = Object.keys(data).length ? JSON.stringify(data) : null;

            // Set up request options
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body ? Buffer.byteLength(body) : 0,
                    ...headers
                }
            };

            // Create request
            const req = request(urlObj, options, (res) => {
                let responseData = '';

                res.on('data', chunk => { responseData += chunk; });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(responseData));
                    } catch (error) {
                        resolve(responseData);
                    }
                });
            });

            req.on('error', reject);

            // Write body if applicable
            if (body) req.write(body);
            req.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = makeApiRequest;
