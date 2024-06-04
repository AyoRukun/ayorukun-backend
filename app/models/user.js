'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      this.hasMany(models.Report, {
        foreignKey: 'user_id',
        sourceKey : 'id',
        name: 'users',
        onDelete: "cascade",
        as : "reports"
      })
      this.hasMany(models.Discussion, {
        foreignKey: 'user_id',
        sourceKey : 'id',
        name: 'users',
        onDelete: "cascade",
        as : "discussions"
      })
      this.hasMany(models.ReportVote, {
        foreignKey: 'user_id',
        sourceKey : 'id',
        name: 'users',
        onDelete: "cascade",
        as : "report_votes"
      })


    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image_url : {
      type: DataTypes.VIRTUAL,
      get() {
        return `https://ui-avatars.com/api/?name=${this.name}&background=random`;
      },
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName : 'users',
    defaultScope: {
      attributes: { exclude: ['password', 'email', 'createdAt', 'updatedAt'] },
    }

  });
  return User;
};
