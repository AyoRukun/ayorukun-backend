'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscussionVote extends Model {
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
  DiscussionVote.init({
    discussion_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    vote_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DiscussionVote',
    tableName : 'discussion_votes'
  });
  return DiscussionVote;
};
