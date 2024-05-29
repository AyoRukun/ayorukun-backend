const Discussion = require('../models').Discussion
const User = require('../models').User
const DiscussionComment = require('../models').DiscussionComment
const sequelize = require('../models').sequelize
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const {Sequelize} = require("sequelize");

const create = async (req, res) => {
    const {content} = req.body

    console.log("\nuser ==> \n", req.user)
    try {
        const discussion = await Discussion.create({
                user_id: req.user.id,
                content,
            },
            {},)
        res.send({
            ...successResponse,
            data: {
                discussion: discussion
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

const index = async (req, res) => {
    try {
        const discussions = await Discussion.findAll({
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.id")), "totalComments"]]
            },
            include: [
                {model: User, as: "user"},
                {model: DiscussionComment, as: "comments", attributes: []},

            ],
            group: ['Discussion.id']
        })
        res.send({
            ...successResponse,
            data: {
                discussions: discussions.map((d) => {
                    const discussion = d.toJSON()
                    const username = discussion.user.name
                    delete discussion.user_id
                    discussion.user = {
                        username,
                        image_url: discussion.user.image_url
                    }
                    return discussion;
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


    const {content, parent_id} = req.body
    const discussionId = req.params.id
    const user = req.user
    console.log("parent_id ==>", parent_id)

    try {
        let comment = await DiscussionComment.create({
            content,
            user_id: req.user.id,
            discussion_id: discussionId,
            parent_id : parent_id
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
const getDetailDiscussion = async (req, res) => {


    const discussionId = req.params.id
    const user = req.user
    try {
        const reports = await Discussion.findOne({
            where: {
                id: discussionId
            },
            include: [
                {model: User, as: "user"},
                {model: DiscussionComment, as: "comments", include : [{model: User, as: "user"}]},
            ],
        })
        res.send({
            ...successResponse,
            data: {
                report: reports
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


module.exports = {create, index, createComment, getDetailReport: getDetailDiscussion}
