#!/usr/bin/env node

require('dotenv').config();
const throng = require('throng');

require('newrelic'); // eslint-disable-line global-require
require('./config/sentry').initializeSentry();

const { redisOptions } = require('./config/redis-info')('probot');
const { getPrivateKey } = require('@probot/get-private-key');
const { Server, Probot } = require('probot');
const app = require('./configure-robot');

const workers = Number(process.env.WEB_CONCURRENCY || 1);

/**
 * Start the probot worker.
 */
async function start() {
  // We are always behind a proxy, but we want the source IP
  const server = new Server({
    Probot: Probot.defaults({
      appId: process.env.APP_ID,
      secret: process.env.WEBHOOK_SECRET,
      privateKey: getPrivateKey(),
      baseUrl: process.env.GHE_HOST && (process.env.GHE_PROTOCOL || 'https') + "://" + process.env.GHE_HOST + "/api/v3",
      redisConfig: redisOptions,
      logLevel: process.env.LOG_LEVEL,
    }),
    port: process.env.TUNNEL_PORT || process.env.PORT || 3000,
    webhookPath: '/github/events',
    webhookProxy: process.env.WEBHOOK_PROXY_URL,
  });

  server.expressApp.set('trust proxy', true);
  await server.load(app)
  server.start()
}

if (workers === 1) {
  start();
} else {
  throng({
    workers,
    lifetime: Infinity,
  }, start);
}
