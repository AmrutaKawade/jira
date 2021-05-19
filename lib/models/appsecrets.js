const Sequelize = require('sequelize');

class AppSecrets extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      githubHost: DataTypes.STRING,
      clientId: DataTypes.STRING,
      appId: DataTypes.INTEGER,
      clientSecret: DataTypes.STRING,
      privateKey: DataTypes.TEXT
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
   * @param {{host: string, clientKey: string, secret: string}} payload
   * @returns {AppSecrets}
   */
  static async insert(payload) {
    const [installation] = await AppSecrets.findOrCreate({
      where: {
        githubHost: payload.githubHost,
      }
    });
    return installation;
  }
}

module.exports = AppSecrets;
