const format = require('date-fns/format');
const moment = require('moment');
const { Subscription } = require('../models');

async function getInstallation(client, subscription) {
  const id = subscription.gitHubInstallationId;
  try {
    const response = await client.apps.getInstallation({ installation_id: id });
    response.data.syncStatus = subscription.isActiveSyncStalled() ? 'STALLED' : subscription.syncStatus;
    response.data.syncWarning = subscription.syncWarning;
    response.data.subscriptionUpdatedAt = formatDate(subscription.updatedAt);
    return response.data;
  } catch (err) {
    return { error: err, id, deleted: err.code === 404 };
  }
}

const formatDate = function (date) {
  return {
    relative: moment(date).fromNow(),
    absolute: format(date, 'MMMM D, YYYY h:mm a'),
  };
};

module.exports = async (req, res) => {
  const jiraHost = req.query.xdm_e;
  const { client } = res.locals;

  const subscriptions = await Subscription.getAllForHost(jiraHost);
  const installations = await Promise.all(subscriptions.map(subscription => getInstallation(client, subscription)));
  const connections = installations
    .filter(response => !response.error)
    .map(data => ({
      ...data,
      isGlobalInstall: data.repository_selection === 'all',
      installedAt: formatDate(data.updated_at),
      syncState: data.syncState,
    }));
  const failedConnections = installations.filter(response => response.error);

  res.render('jira-configuration.hbs', {
    host: req.query.xdm_e,
    githubHost: req.query.githubHost,
    connections,
    failedConnections,
    hasConnections: connections.length > 0 || failedConnections.length > 0,
    APP_URL: process.env.APP_URL,
    csrfToken: req.csrfToken(),
  });
};
