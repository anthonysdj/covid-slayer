const bcrypt = require('bcrypt');

const hasher = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pass, salt);

    console.log(hashedPwd);

    return hashedPwd;
}

module.exports = hasher;