const url = require('url');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisInfo = url.parse(REDIS_URL);

/** @type {string} */
let password = null;
if (redisInfo.auth && redisInfo.auth.split(':').length === 2) {
  password = redisInfo.auth.split(':')[1];
}


/**
 * @param {string} connectionName - The name for the connection
 * @returns {{REDIS_URL: string, redisOptions: import('ioredis').RedisOptions}}
 */
module.exports = (connectionName) => ({
  REDIS_URL,
  redisOptions: {
    password: process.env.REDIS_PWD,
    port: process.env.REDIS_PORT || redisInfo.port || 6379,
    host: process.env.REDIS_HOST || redisInfo.hostname,
    db: redisInfo.pathname ? redisInfo.pathname.split('/')[1] : 0,
    connectionName,
  },
});
