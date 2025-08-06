const bcrypt = require("bcrypt");

exports.hashedPsssword = async (password) => {
    return await bcrypt.hash(password, 10);
}

exports.comparePassword = async(hashPassword, password) => {
    return await bcrypt.compare(password, hashPassword);
}