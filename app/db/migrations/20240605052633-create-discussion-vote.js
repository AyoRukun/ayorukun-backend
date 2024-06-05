'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discussion_votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id : {
        type: Sequelize.INTEGER,
        references: {model: 'users', key: 'id'},
        onDelete: 'CASCADE',
        allowNull: false,
      },
      discussion_id: {
        type: Sequelize.INTEGER,
        references: {model: 'discussions', key: 'id'},
        onDelete: 'CASCADE',
        allowNull: false,
      } ,
      vote_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discussion_votes');
  }
};
