'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportComment extends Model {

    static associate(models) {
      this.belongsTo(models.Report, {
        foreignKey: "report_id",
        targetKey: "id",
        as: "report",
        onDelete: "CASCADE"
      })
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
        onDelete: "CASCADE"
      })

    }
  }
  ReportComment.init({
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportComment',
    tableName: 'report_comments'
  });
  return ReportComment;
};
