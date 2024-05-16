'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.ReportFile, {
                foreignKey: 'report_id',
                sourceKey : 'id',
                name: 'reportId',
                onDelete: "cascade",
                as : "report_files"
            })

        }
    }

    Report.init({
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        region: DataTypes.STRING,
        school_name: DataTypes.STRING,
        case_date: DataTypes.DATE,
        report_as: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Report',
        tableName: 'reports'
    });
    return Report;
};
