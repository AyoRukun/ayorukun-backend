const User = require('../models').User
const bcrypt = require('bcrypt')
const generateAccessToken = require('../utils/generateAccessToken')
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const {body} = require("express-validator");
const generateUsername = require("../utils/generateUsername");
const {validationResult} = require('express-validator');

async function getRandomUsername() {
    const username = generateUsername();
    const userWithUsername = await User.findOne({
        where: {
            name: username
        }
    })
    if (userWithUsername) {
        return getRandomUsername();
    } else {
        return username;
    }
}

const signUp = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({...errorResponse, message: errors.array()[0].msg});
        return;
    }
    try {
        const userWithEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (userWithEmail) {
            res.status(409).send({
                success: false,
                message: "Email already taken!"
            });
            return;
        }

        const username = await getRandomUsername();
        console.log("username ==> ", username)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userCreated = await User.create({
            name: username,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({...errorResponse, message: errors.array()[0].msg});
        return;
    }

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


const validate = (method) => {
    switch (method) {
        case 'register': {
            return [
                body('email', 'Invalid email!').exists().isEmail(),
                body('password', "Password is required!").exists(),
            ]
        }
        case 'login': {
            return [
                body('email', 'Invalid email!').exists().isEmail(),
                body('password', "Password is required!").exists(),
            ]
        }

    }
}

module.exports = {signUp, signIn, validate}
