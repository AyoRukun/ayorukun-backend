const Province = require('../models').Province
const Regency = require('../models').Regency
const District = require('../models').District
const Sequelize = require('sequelize');
const sequelize = require('../models').sequelize;
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const {QueryTypes} = require("sequelize");
const searchProvinceRegency = async (req, res) => {

    const q = req.query.q
    const query =
        "SELECT p.id as province_id , p.name as province_name, " +
        "r.id as regency_id , r.name as regency_name, " +
        " d.name as district_name " +
        "FROM reg_provinces as p " +
        "INNER JOIN reg_regencies as r ON p.id = r.province_id " +
        "INNER JOIN reg_districts as d ON r.id = d.regency_id " +
        "WHERE p.name LIKE '%" + q + "' " +
        "OR r.name  LIKE '%" + q + "%' " +
        "OR d.name  LIKE '%" + q + "%' ";
    const results = await sequelize.query(query, {
        type: QueryTypes.SELECT,
    });

    const mappedData = results.map((r) => {
        if (r.district_name.toLowerCase().includes(q.toLowerCase())) {
            return {
                text: `Kecamatan : ${r.district_name}`,
                description: `Provinsi : ${r.province_name}, ${r.regency_name} `
            }
        }
        if (r.regency_name.toLowerCase().includes(q.toLowerCase())) {
            return {
                text: r.regency_name,
                description: `Provinsi : ${r.province_name}`
            }
        }
        if (r.province_name.toLowerCase().includes(q.toLowerCase())) {
            return {
                text: `Provinsi : ${r.province_name}`,
                description: "Nasional"
            }
        }
    })

    const uniqData = [];
    let uniqueObject = {};

    for (let i in mappedData) {
        const text = mappedData[i].text;
        uniqueObject[text] = mappedData[i];
    }
    for (let i in uniqueObject) {
        uniqData.push(uniqueObject[i]);
    }

    return res.send({
        ...successResponse,
        data: {
            results: uniqData
        }
    })

}


module.exports = {searchProvinceRegency}
