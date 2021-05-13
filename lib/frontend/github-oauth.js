/*
 * Copied from https://github.com/maxogden/github-oauth/blob/master/index.js
 * But it had a vulnerability on the `request` package version range.
 * So, instead of making a fork, since it's only one file and the package
 * hasn't been updated in 3 years I thought it was simpler to just copy the source here
 */
const request = require('request');
const events = require('events');
const url = require('url');
const crypto = require('crypto');
const { getInstanceMetadata } = require('../common/helper');


module.exports = function (opts) {
  if (!opts.callbackURI) opts.callbackURI = '/github/callback';
  if (!opts.loginURI) opts.loginURI = '/github/login';
  if (typeof opts.scope === 'undefined') opts.scope = 'user';
  const state = crypto.randomBytes(8).toString('hex');
  const urlObj = url.parse(opts.baseURL);
  urlObj.pathname = url.resolve(urlObj.pathname, opts.callbackURI);
  const redirectURI = url.format(urlObj);
  const emitter = new events.EventEmitter();

  function addRoutes(router, loginCallback) {
    // compatible with flatiron/director
    router.get(opts.loginURI, login);
    router.get(opts.callbackURI, callback);
    if (!loginCallback) return;
    emitter.on('error', (token, err, resp, tokenResp, req) => {
      loginCallback(err, token, resp, tokenResp, req);
    });
    emitter.on('token', (token, resp, tokenResp, req) => {
      loginCallback(false, token, resp, tokenResp, req);
    });
  }

  function login(req, resp) {
    const host = req.session.githubHost || 'github.com';
    const ghaeInstaneData = getInstanceMetadata(host);
    //get cient id client secret and private key for host from DB
    const u = `https://${host}/login/oauth/authorize` +
        `?client_id=${ghaeInstaneData.clientId
        }${opts.scope ? `&scope=${opts.scope}` : ''
        }&redirect_uri=${redirectURI
        }&state=${state}`;

    resp.statusCode = 302;
    resp.setHeader('location', u);
    resp.end();
  }

  function callback(req, resp, cb) {
    const host = req.session.githubHost || 'github.com';
    const ghaeInstaneData = getInstanceMetadata(host);
    const { query } = url.parse(req.url, true);
    const { code } = query;
    if (!code) return emitter.emit('error', { error: 'missing oauth code' }, resp);
    const u = `https://${host}/login/oauth/access_token` +
       `?client_id=${ghaeInstaneData.clientId
       }&client_secret=${ghaeInstaneData.clientSecret
       }&code=${code
       }&state=${state}`;

    request.get({ url: u, json: true }, (err, tokenResp, body) => {
      if (err) {
        if (cb) {
          err.body = body;
          err.tokenResp = tokenResp;
          return cb(err);
        }
        return emitter.emit('error', body, err, resp, tokenResp, req);
      }
      if (cb) {
        cb(null, body);
      }
      emitter.emit('token', body, resp, tokenResp, req);
    });
  }

  emitter.login = login;
  emitter.callback = callback;
  emitter.addRoutes = addRoutes;
  return emitter;
};
