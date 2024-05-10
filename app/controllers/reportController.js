const Report = require('../models').Report
const {successResponse, errorResponse} = require('../utils/defaultResponse')

const create = async (req, res) => {
    const { title, content, school_name , case_date , report_as} = req.body
    try {
        const report = await Report.create({
            title,
            content,
            school_name,
            case_date,
            report_as
        })
        res.send({
            ...successResponse,
            data: {
                report: report
            }
        })

    } catch (e) {
        res.status(500).send({
            ...errorResponse,
            message : "Something went wrong!",
            errors: e
        })
    }

}


module.exports = {create }
