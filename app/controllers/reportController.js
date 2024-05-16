const Report = require('../models').Report
const ReportFile = require('../models').ReportFile
const sequelize = require('../models').sequelize
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const reportFileUpload = require("../middleware/reportFileUpload")
const multer = require("multer");
const {validationResult} = require("express-validator");
const reportValidator = require('../middleware/validator/reportValidator')
const fs = require("fs");
const create = async (req, res) => {


    reportFileUpload(req, res, async function (err) {
        await Promise.all(reportValidator("create").map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({...errorResponse, message: errors.array()[0].msg})
            return
        }

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({...errorResponse, message: err.message})
                return
            }
        } else if (err) {
            res.status(400).json({...errorResponse, message: err.message})
            return
        }

        const t = await sequelize.transaction();
        const {title, content, school_name, case_date, report_as,region} = req.body
        try {

            const reportFiles = []
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const reportFile = {
                    type: file.mimetype.includes("image") ? 'image' : 'video',
                    path: file.path
                };
                reportFiles.push(reportFile)
            }

            const report = await Report.create({
                id : 3,
                    title,
                    content,
                    school_name,
                    region,
                    case_date,
                    report_as,
                    report_files: reportFiles,
                },
                {
                    include: [{model: ReportFile, as: "report_files"}],
                    transaction: t
                },)
            await t.commit();
            res.send({
                ...successResponse,
                data: {
                    report: report
                }
            })

        } catch (e) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                fs.unlink(file.path,(err) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(`File removed ${file.path}`);
                })
            }
            await t.rollback();
            res.status(500).send({
                ...errorResponse,
                message: "Something went wrong!",
                errors: e
            })
        }
    })
}

const index = async (req, res) => {
    try{
        const reports = await  Report.findAll({
            include: [{model: ReportFile, as: "report_files"}],
        })
        res.send({
            ...successResponse,
            data: {
                reports: reports
            }
        })

    }catch (e){
        res.status(500).send({
            ...errorResponse,
            message: "Something went wrong!",
            errors: e
        })
    }
}


module.exports = {create, index}
