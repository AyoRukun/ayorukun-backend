'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Regency, {
        foreignKey: 'province_id',
        sourceKey : 'id',
        name: 'provinceId',
        onDelete: "cascade",
        as : "regencies"
      })

    }
  }
  Province.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Province',
    tableName: 'reg_provinces'
  });
  return Province;
};
