'use strict';

const envs = process.env;

module.exports = {
  port: envs.SERVER_PORT || 3000};
