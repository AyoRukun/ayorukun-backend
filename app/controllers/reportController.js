const Report = require('../models').Report
const ReportFile = require('../models').ReportFile
const User = require('../models').User
const ReportComment = require('../models').ReportComment
const sequelize = require('../models').sequelize
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const reportFileUpload = require("../middleware/reportFileUpload")
const multer = require("multer");
const {validationResult} = require("express-validator");
const reportValidator = require('../middleware/validator/reportValidator')
const fs = require("fs");
const {Sequelize} = require("sequelize");

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
        console.log("\nuser ==> \n", req.user)

        const t = await sequelize.transaction();
        const {title, content, school_name, case_date, report_as, region} = req.body
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
                    user_id: req.user.id,
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
                fs.unlink(file.path, (err) => {
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
    try {
        const reports = await Report.findAll({
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.id")), "totalComments"]]
            },
            include: [
                {model: ReportFile, as: "report_files"},
                {model: User, as: "user"},
                {model: ReportComment, as: "comments", attributes: []},

            ],
            group: ['Report.id', 'report_files.id']
        })
        res.send({
            ...successResponse,
            data: {
                reports: reports.map((r) => {
                    const report = r.toJSON()
                    const username = report.user.name
                    delete report.user_id
                    report.user = {
                        username,
                        image_url: report.user.image_url
                    }
                    return report;
                })
            }
        })

    } catch (e) {
        console.log("error " + e)
        res.status(500).send({
            ...errorResponse,
            message: "Something went wrong!",
            errors: e
        })
    }
}


const createComment = async (req, res) => {


    const {content} = req.body
    const reportId = req.params.id
    const user = req.user
    try {
        let comment = await ReportComment.create({
                content,
                user_id: req.user.id,
                report_id: reportId,
            },        )

        comment = comment.toJSON()
        delete comment.user_id;
        comment.owner = {
            id : user.id,
            username : user.name,
            image_url: user.image_url,
        }

        res.send({
            ...successResponse,
            data: {
                comment: comment            }
        })

    } catch (e) {
        res.status(500).send({
            ...errorResponse,
            message: "Something went wrong!",
            errors: e
        })
    }

}
const getDetailReport = async (req, res) => {


    const reportId = req.params.id
    const user = req.user
    try {
        const reports = await Report.findOne({
            where : {
                id : reportId
            },
            // attributes: {
            //     include: [[Sequelize.fn("COUNT", Sequelize.col("report_comments.id")), "totalComments"]]
            // },
            include: [
                {model: ReportFile, as: "report_files"},
                {model: User, as: "user"},
                {model: ReportComment, as: "comments", include : [{model: User, as: "user"}]},

            ]
        })
        res.send({
            ...successResponse,
            data: {
                report : reports
            }
        })




    } catch (e) {
        res.status(500).send({
            ...errorResponse,
            message: "Something went wrong!",
            errors: e
        })
    }

}


module.exports = {create, index, createComment,getDetailReport}
