'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportCommentVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ReportComment, {
        foreignKey: "comment_id",
        targetKey: "id",
        as: "comment",
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
  ReportCommentVote.init({
    comment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    vote_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReportCommentVote',
    tableName : 'report_comment_votes'
  });
  return ReportCommentVote;
};
