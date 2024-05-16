'use strict';

const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     // fs.readFile('wilayah_indonesia.sql').then(sql => Sequelize.query(sql.toString()))
  },

  async down (queryInterface, Sequelize) {

  }
};
