var crypto = require('crypto');

function createPassword (password) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    console.log('==========================salt==========================\n', salt);
    console.log('==========================hash==========================\n', hash);
};

createPassword('HardHome3@');
