'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Regency, {
        foreignKey: "regency_id",
        targetKey: "id",
        as: "regency",
        onDelete: "CASCADE"
      })

    }
  }
  District.init({
    regency_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'District',
    tableName: 'reg_districts'
  });
  return District;
};
