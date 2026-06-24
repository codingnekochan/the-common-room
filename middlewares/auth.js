const bcrypt = require("bcryptjs");

const validatePassword = async (password, hash) => {
  const checkPassword = bcrypt.compare(password, hash);
  return checkPassword;
};

const generateHash = async (password) => {
  const salt = Number(process.env.SALT) || 11;
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

module.exports = { validatePassword, generateHash };
