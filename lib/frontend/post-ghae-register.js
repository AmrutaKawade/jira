const crypto = require('crypto');
const url = require('url');
const fetch = require("node-fetch");
const { AppSecrets } = require('../models');

module.exports = function (opts) {
  if (!opts.callbackURI) opts.callbackURI = '/ghaeRegisterComplete';
  if (!opts.registerURI) opts.registerURI = '/register';

  registration_data = JSON.stringify({"name": "Jira-App",
    "url": "https://github.com/apps/Jira-App",
    "hook_attributes": {
        "url": "https://amk-jira.loca.lt/github/events",
    },
    "redirect_url": "https://amk-jira.loca.lt/ghaeRegisterComplete/",
    "callback_urls": [
        "https://amk-jira.loca.lt/github/callback"
    ],
    "setup_url": "https://amk-jira.loca.lt/github/setup",
    "default_permissions": {
        "issues": "write",
        "contents": "read",
        "metadata": "read",
        "pull_requests": "write"

      },
      "default_events": [
        "create",
        "commit_comment",
        "delete",
        "issue_comment",
        "issues",
        "pull_request",
        "pull_request_review",
        "pull_request_review_comment",
        "push"

      ],
      
    "public": true})

  function addRoutes(router, loginCallback) {
    // compatible with flatiron/director
    router.post(opts.registerURI, (res, req) => register(res, req));
    router.get(opts.callbackURI, callback);
  }

  async function register(req, res, redirectUrl) {
    const { query } = url.parse(req.url, true);
    const {
      ghaeHost
    } = query;
    console.log(ghaeHost);
  
    const state = crypto.randomBytes(8).toString('hex');
    //save state and host
    console.log("Register called");
    return res.json({
        manifest: registration_data,
        state
    });
  }

  async function callback(req, res, next) {
    const { query } = url.parse(req.url, true);
    const {
      code,
      state,
    } = query;
    //retrive ghaeHost from state
    host = "ghaebuild50276.ghaekube.net"
    // Check if state is available and matches a previous request
    if (!state) return next(new Error('Missing matching Auth state parameter'));
    if (!code) return next(new Error('Missing OAuth Code'));
    console.log("callback called");
    url_fetch = `https://${host}/api/v3/app-manifests/${code}/conversions`
    var result = undefined

    result = await fetch(url_fetch,{
            method: "POST",
            headers:{
              "accept": "application/vnd.github.v3+json"
          }
          }).then(response => response.json()).then(data => {return data}).catch((error) => {
            console.error('Error:', error);
          });
    
    const secrets = await AppSecrets.insert({
      clientId: result.client_id, 
      clientSecret: result.client_secret, 
      privateKey: result.pem, 
      appId: result.id,
      githubHost: new URL(result.html_url).hostname
    });

    return res.render("ghae_register_complete.hbs", {
      app: JSON.stringify(result)
    });
  }

  return {
    addRoutes
  };
};
