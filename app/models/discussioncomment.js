'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscussionComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Discussion, {
        foreignKey: "discussion_id",
        targetKey: "id",
        as: "discussion",
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
  DiscussionComment.init({
    content: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DiscussionComment',
    tableName : 'discussion_comments',
  });
  return DiscussionComment;
};
