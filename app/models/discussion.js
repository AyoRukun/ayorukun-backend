'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
        onDelete: "CASCADE"
      })
      this.hasMany(models.DiscussionComment, {
        foreignKey: 'discussion_id',
        sourceKey : 'id',
        name: 'discussions',
        onDelete: "cascade",
        as : "comments"
      })
      this.hasMany(models.DiscussionVote, {
        foreignKey: 'discussion_id',
        sourceKey : 'id',
        name: 'discussions',
        onDelete: "cascade",
        as : "votes"
      })



    }
  }
  Discussion.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Discussion',
    tableName: 'discussions'

  });
  return Discussion;
};
