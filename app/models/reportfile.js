'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReportFile extends Model {
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
        }
    }

    ReportFile.init({
        report_id: DataTypes.INTEGER,
        path: DataTypes.STRING,
        type: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ReportFile',
        tableName: 'report_files'

    });
    return ReportFile;
};
