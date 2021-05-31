const Sequelize = require('sequelize');

class AppSecrets extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      githubHost: DataTypes.STRING,
      clientId: DataTypes.STRING,
      appId: DataTypes.INTEGER,
      clientSecret: DataTypes.STRING,
      privateKey: DataTypes.TEXT,
      webhookSecret: DataTypes.STRING,
    }, { sequelize });
  }

  static async getForHost(host) {
    return AppSecrets.findOne({
      where: {
        githubHost: host
      },
    });
  }

  /**
   * Create a new Installation object from a Jira Webhook
   *
   * @param {{clientId: string, clientSecret: string, privateKey: string, appId: int, webhookSecret: string}} payload
   * @returns {AppSecrets}
   */
  static async insert(payload) {
    const [installation] = await AppSecrets.findOrCreate({
      where: {
        githubHost: payload.githubHost,
        clientId: payload.clientId,
        clientSecret: payload.clientSecret,
        appId: payload.appId,
        privateKey: payload.privateKey,
        webhookSecret: payload.webhookSecret,
      }
    });
    return installation;
  }
}

module.exports = AppSecrets;
