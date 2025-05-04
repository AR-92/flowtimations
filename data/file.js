const fs = require('fs');
const path = require('path');

/**
 * Fetches the contents and metadata of a file.
 * 
 * @param {string} filePath - The path to the file.
 * @param {string} [encoding='utf8'] - Encoding type (default is 'utf8').
 * @returns {Promise<object>} - An object containing file content and metadata.
 * 
 * @example
 * // Fetch a text file
 * fetchFileContents('./example.txt')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * 
 * @example
 * // Fetch a binary file (e.g., an image)
 * fetchFileContents('./image.png', 'base64')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
async function fetchFileContents(filePath, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err) return reject(err);

            fs.readFile(filePath, encoding, (err, content) => {
                if (err) return reject(err);

                resolve({
                    filePath: path.resolve(filePath),
                    fileName: path.basename(filePath),
                    extension: path.extname(filePath),
                    size: stats.size, // File size in bytes
                    createdAt: stats.birthtime, // File creation date
                    modifiedAt: stats.mtime, // Last modification date
                    content
                });
            });
        });
    });
}

module.exports = fetchFileContents;
