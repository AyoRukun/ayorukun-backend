const User = require('../models').User
const bcrypt = require('bcrypt')
const generateAccessToken = require('../utils/generateAccessToken')
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const signUp = async (req, res) => {
    console.log("called")
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userCreated = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        res.send({
            ...successResponse,
            data: {
                user: userCreated
            }
        })

    } catch (e) {
        res.status(500).send({
            error: true,
            message: "Error",
            errors: e
        })
    }

}

const signIn = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        }
    })
    if (!user) {
        res.status(404).send({
            ...errorResponse,
            message: "User not found!"
        })
    }
    const hashedPass = user.password
    if (!await bcrypt.compare(req.body.password, hashedPass)) {
        res.status(401).send({
            ...errorResponse,
            message: "Email & password doesnt match!"
        })
        return

    }
    console.log("---------> Login Successful")
    console.log("---------> Generating accessToken")
    const token = generateAccessToken({user: user})
    res.send({
        ...successResponse,
        data: {
            user: user,
            accessToken: token
        }
    })

}

module.exports = {signUp, signIn}
