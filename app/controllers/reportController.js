const Report = require('../models').Report
const ReportFile = require('../models').ReportFile
const User = require('../models').User
const ReportComment = require('../models').ReportComment
const ReportVote = require('../models').ReportVote
const ReportCommentVote = require('../models').ReportCommentVote
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

            let report = await Report.create({
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
            report = report.toJSON();
            report.likeBy = []
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
        const reportsData = []
        for (let i = 0; i < reports.length; i += 1) {
            const votes = await reports[i].getVotes()
            const report = reports[i].toJSON()
            report.likedBy = votes.filter((v) => v.vote_type === 1).map((v) => v.user_id);
            const username = report.user.name
            delete report.user_id
            report.user = {
                username,
                image_url: report.user.image_url
            }
            reportsData.push(report)

        }
        res.send({
            ...successResponse,
            data: {
                reports: reportsData
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
        },)

        comment = comment.toJSON()
        delete comment.user_id;
        comment.owner = {
            id: user.id,
            username: user.name,
            image_url: user.image_url,
        }

        res.send({
            ...successResponse,
            data: {
                comment: comment
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
const getDetailReport = async (req, res) => {
    const reportId = req.params.id
    try {
        const report = await Report.findOne({
            where: {
                id: reportId
            },
            include: [
                {model: ReportFile, as: "report_files"},
                {model: User, as: "user"},
                {
                    model: ReportComment, as: "comments", include: [
                        {model: User, as: "user"},]
                },
            ]
        })

        const commentIds = report.comments.map((c) => c.id);
        const commentVotes = await ReportCommentVote.findAll({
            where: {
                comment_id: commentIds,
                vote_type: 1
            }
        })
        const reportData = report.toJSON();
        for (const comment of reportData.comments) {
            comment.likedBy = commentVotes.filter((v) => v.comment_id === comment.id).map((v) => v.user_id)
        }
        res.send({
            ...successResponse,
            data: {
                report: reportData
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

const likeReport = async (req, res) => {
    const reportId = req.params.id
    const user = req.user
    try {
        let reportVote = await ReportVote.findOne({
            where: {
                report_id: reportId,
                user_id: user.id
            },
        })

        if (!reportVote) {
            reportVote = await ReportVote.create({
                user_id: user.id,
                report_id: reportId,
                vote_type: 1
            })
        } else {
            await reportVote.update({
                vote_type: 1
            })
        }
        res.send({
            ...successResponse,
            data: {
                vote: reportVote
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

const unlikeReport = async (req, res) => {
    const reportId = req.params.id
    const user = req.user
    try {
        let reportVote = await ReportVote.findOne({
            where: {
                report_id: reportId,
                user_id: user.id
            },
        })

        if (!reportVote) {
            reportVote = await ReportVote.create({
                user_id: user.id,
                report_id: reportId,
                vote_type: 0
            })
        } else {
            await reportVote.update({
                vote_type: 0
            })
        }
        res.send({
            ...successResponse,
            data: {
                vote: reportVote
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

const likeComment = async (req, res) => {
    const commentId = req.params.commentId
    console.log(`Tes comment ${commentId}`)
    const user = req.user
    try {
        let vote = await ReportCommentVote.findOne({
            where: {
                comment_id: commentId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await ReportCommentVote.create({
                comment_id: commentId,
                user_id: user.id,
                vote_type: 1
            })
        } else {
            await vote.update({
                vote_type: 1
            })
        }
        res.send({
            ...successResponse,
            data: {
                vote: vote
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

const unlikeComment = async (req, res) => {
    const commentId = req.params.commentId

    const user = req.user
    try {
        let vote = await ReportCommentVote.findOne({
            where: {
                comment_id: commentId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await ReportCommentVote.create({
                user_id: user.id,
                comment_id: commentId,
                vote_type: 0
            })
        } else {
            await vote.update({
                vote_type: 0
            })
        }
        res.send({
            ...successResponse,
            data: {
                vote: vote
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


module.exports = {create, index, createComment, getDetailReport, likeReport, unlikeReport, likeComment, unlikeComment}
