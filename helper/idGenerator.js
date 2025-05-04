const crypto = require('crypto');

exports.uuid4 = () => {
    return crypto.randomUUID(); // Built-in method for UUID generation
};

