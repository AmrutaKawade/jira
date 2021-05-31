'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('AppSecrets', 'webhookSecret', {
        type: Sequelize.STRING,
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('AppSecrets', 'webhookSecret');
  },
};
