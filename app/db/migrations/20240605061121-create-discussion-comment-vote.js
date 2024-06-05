'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discussion_comment_votes', {
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
        references: {model: 'discussion_comments', key: 'id'},
        onDelete: 'CASCADE',
        allowNull: false,
      } ,
      vote_type: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discussion_comment_votes');
  }
};
