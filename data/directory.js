const fs = require('fs');
const path = require('path');

/**
 * Recursively fetches the contents of a directory.
 * 
 * @param {string} dirPath - The directory path to fetch.
 * @param {boolean} [recursive=true] - Whether to fetch subdirectories recursively.
 * @returns {Promise<object>} - An object containing files and directories.
 * 
 * @example
 * // Fetch contents of a directory (non-recursive)
 * fetchDirectoryContents('./my-folder', false)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * 
 * @example
 * // Fetch contents of a directory (recursive)
 * fetchDirectoryContents('./my-folder', true)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
async function fetchDirectoryContents(dirPath, recursive = true) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
            if (err) return reject(err);

            const files = [];
            const directories = [];

            // Process each entry in the directory
            const tasks = entries.map(entry => {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isFile()) {
                    files.push(fullPath);
                } else if (entry.isDirectory()) {
                    directories.push(fullPath);

                    if (recursive) {
                        // Recursively fetch subdirectory contents
                        return fetchDirectoryContents(fullPath, recursive)
                            .then(subContents => {
                                files.push(...subContents.files);
                                directories.push(...subContents.directories);
                            });
                    }
                }
            });

            Promise.all(tasks)
                .then(() => resolve({ files, directories }))
                .catch(reject);
        });
    });
}

module.exports = fetchDirectoryContents;
