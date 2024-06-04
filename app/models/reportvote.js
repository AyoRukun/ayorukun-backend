'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
  ReportVote.init({
    user_id: DataTypes.INTEGER,
    report_id: DataTypes.INTEGER,
    vote_type : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReportVote',
    tableName : 'report_votes'
  });
  return ReportVote;
};
