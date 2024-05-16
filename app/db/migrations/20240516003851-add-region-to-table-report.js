'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'reports',
        'region',
        {
          after : "content",
          type :  Sequelize.STRING,}

    );

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'reports',
        'region'
    );
  }
};
