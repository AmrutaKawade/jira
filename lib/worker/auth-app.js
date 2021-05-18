const { getPrivateKey } = require('@probot/get-private-key');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require("@octokit/core");

function AuthApp(options = {}) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      id: options.appId,
      privateKey: getPrivateKey({ filepath : options.privateKeyPath } ),
      installationId: options.installationId
    },
    baseUrl: "https://" + options.githubHost + "/api/v3"
  });
}

module.exports = { 
  AuthApp 
};