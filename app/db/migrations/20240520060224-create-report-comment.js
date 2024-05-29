'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('report_comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            report_id: {
                type: Sequelize.INTEGER,
                references: {model: 'reports', key: 'id'},
                onDelete: 'CASCADE',
                allowNull: false,
            },
            user_id : {
                type: Sequelize.INTEGER,
                references: {model: 'users', key: 'id'},
                onDelete: 'CASCADE',
                allowNull: false,
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
        await queryInterface.dropTable('report_comments');
    }
};
