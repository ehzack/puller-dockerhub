'use strict';

const envs = process.env;

module.exports = {
  port: envs.SERVER_PORT || 3000,
  token: envs.TOKEN_KEY || '123456',
};
