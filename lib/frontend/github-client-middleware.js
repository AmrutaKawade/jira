const { GitHubAPI } = require('../config/github-api');
const { getSignedJsonWebToken } = require('../common/helper');

module.exports = (getAppToken) => (req, res, next) => {
  if (req.session.githubToken) {
    res.locals.github = GitHubAPI({
      auth: { token : req.session.githubToken },
      baseUrl: process.env.GHE_HOST && (process.env.GHE_PROTOCOL || 'https') + "://" + process.env.GHE_HOST + "/api/v3",
    });
  } else {
    res.locals.github = GitHubAPI();
  }

  const isAdminFunction = isAdmin(res.locals.github);

  const appClient = GitHubAPI({
    auth: { token : getSignedJsonWebToken(getAppToken.state) },
    baseUrl: process.env.GHE_HOST && (process.env.GHE_PROTOCOL || 'https') + "://" + process.env.GHE_HOST + "/api/v3",
  });

  res.locals.client = appClient;
  res.locals.isAdmin = isAdminFunction;

  next();
};

/**
 * @returns true if the user is an admin of the Org or if the repo belongs to that user
 */
function isAdmin(githubClient) {
  return async function ({ org, username, type }) {
    // If this is a user installation, the "admin" is the user that owns the repo
    if (type === 'User') {
      return org === username;
    }

    // Otherwise this is an Organization installation and we need to ask GitHub for role of the logged in user
    try {
      const {
        data: { role },
      } = await githubClient.orgs.getMembership({ org, username });
      return role === 'admin';
    } catch (err) {
      console.log(err);
      console.log(`${org} has not accepted new permission for getOrgMembership`);
      console.log(`error=${err} org=${org}`);
      return false;
    }
  };
}


module.exports.isAdminFunction = isAdmin;
