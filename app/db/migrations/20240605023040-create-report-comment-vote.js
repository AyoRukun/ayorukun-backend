'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('report_comment_votes', {
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
      comment_id: {
        type: Sequelize.INTEGER,
        references: {model: 'comments', key: 'id'},
        onDelete: 'CASCADE',
        allowNull: false,
      }  ,
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
    await queryInterface.dropTable('report_comment_votes');
  }
};
