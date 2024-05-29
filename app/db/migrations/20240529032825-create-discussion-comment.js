'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('discussion_comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            discussion_id: {
                type: Sequelize.INTEGER,
                references: {model: 'discussions', key: 'id'},
                onDelete: 'CASCADE',
                allowNull: false,
            }, user_id: {
                type: Sequelize.INTEGER,
                references: {model: 'users', key: 'id'},
                onDelete: 'CASCADE',
                allowNull: false,
            },
            parent_id: {
                type: Sequelize.INTEGER,
                references: {model: 'discussion_comments', key: 'id'},
                onDelete: 'CASCADE',
                allowNull: true,
            },
            content: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('discussion_comments');
    }
};
