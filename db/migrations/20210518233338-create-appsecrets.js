'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AppSecrets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      githubHost: {
        type: Sequelize.STRING
      },
      clientId: {
        type: Sequelize.STRING
      },
      clientSecret: {
        type: Sequelize.STRING
      },
      privateKey: {
        type: Sequelize.TEXT
      },
      appId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AppSecrets')
  }
}
