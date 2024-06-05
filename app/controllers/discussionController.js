const Discussion = require('../models').Discussion
const User = require('../models').User
const DiscussionComment = require('../models').DiscussionComment
const DiscussionVote = require('../models').DiscussionVote
const DiscussionCommentVote = require('../models').DiscussionCommentVote
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const {Sequelize} = require("sequelize");

const create = async (req, res) => {
    const {content, title} = req.body

    try {
        const discussion = await Discussion.create({
                user_id: req.user.id,
                title,
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

        const discussionsData = []
        for (let i = 0; i < discussions.length; i += 1) {
            const votes = await discussions[i].getVotes()
            const discussion = discussions[i].toJSON()
            discussion.likedBy = votes.filter((v) => v.vote_type === 1).map((v) => v.user_id);
            const username = discussion.user.name
            delete discussion.user_id
            discussion.user = {
                username,
                image_url: discussion.user.image_url
            }
            discussionsData.push(discussion)

        }
        res.send({
            ...successResponse,
            data: {
                discussions: discussionsData
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
            parent_id: parent_id
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
    try {
        const discussion = await Discussion.findOne({
            where: {
                id: discussionId
            },
            include: [
                {model: User, as: "user"},
                {model: DiscussionComment, as: "comments", include: [{model: User, as: "user"}]},
            ],
        })

        const commentIds = discussion.comments.map((c) => c.id);
        const commentVotes = await DiscussionCommentVote.findAll({
            where: {
                comment_id: commentIds,
                vote_type: 1
            }
        })
        const discussionData = discussion.toJSON();
        for (const comment of discussionData.comments) {
            comment.likedBy = commentVotes.filter((v) => v.comment_id === comment.id).map((v) => v.user_id)
        }
        res.send({
            ...successResponse,
            data: {
                report: discussionData
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


const likeDiscussion = async (req, res) => {
    const discussionId = req.params.id
    const user = req.user
    try {
        let vote = await DiscussionVote.findOne({
            where: {
                discussion_id: discussionId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await DiscussionVote.create({
                user_id: user.id,
                discussion_id: discussionId,
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
const unlikeDiscussion = async (req, res) => {
    const discussionId = req.params.id
    const user = req.user
    try {
        let vote = await DiscussionVote.findOne({
            where: {
                discussion_id: discussionId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await DiscussionVote.create({
                user_id: user.id,
                discussion_id: discussionId,
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

const likeDiscussionComment = async (req, res) => {
    const discussionId = req.params.id
    const commentId = req.params.commentId
    const user = req.user
    try {
        let vote = await DiscussionCommentVote.findOne({
            where: {
                comment_id: commentId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await DiscussionCommentVote.create({
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

const unlikeDiscussionComment = async (req, res) => {
    const discussionId = req.params.id
    const commentId = req.params.commentId
    const user = req.user
    try {
        let vote = await DiscussionCommentVote.findOne({
            where: {
                comment_id: commentId,
                user_id: user.id
            },
        })

        if (!vote) {
            vote = await DiscussionCommentVote.create({
                comment_id: commentId,
                user_id: user.id,
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


module.exports = {
    create,
    index,
    createComment,
    getDetailReport: getDetailDiscussion,
    likeDiscussion,
    unlikeDiscussion,
    likeDiscussionComment,
    unlikeDiscussionComment
}
