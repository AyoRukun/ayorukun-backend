'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Regency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Province, {
        foreignKey: "province_id",
        targetKey: "id",
        as: "province",
        onDelete: "CASCADE"
      })
      this.hasMany(models.District, {
        foreignKey: 'regency_id',
        sourceKey : 'id',
        name: 'regencyId',
        onDelete: "cascade",
        as : "districts"
      })


    }
  }
  Regency.init({
    province_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Regency',
    tableName: 'reg_regencies'
  });
  return Regency;
};
