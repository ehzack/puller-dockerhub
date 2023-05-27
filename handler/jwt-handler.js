var jwt = require('jsonwebtoken');

const config = require('../config');
const TOKEN_KEY = config.token;

const doSign = (object) => jwt.sign(object, TOKEN_KEY);
const doVerify = (token) => jwt.verify(token, TOKEN_KEY);

module.exports = {
  TOKEN_KEY,
  doSign,
  doVerify,
};
