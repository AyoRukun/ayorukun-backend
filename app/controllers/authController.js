const User = require('../models').User
const bcrypt = require('bcrypt')
const generateAccessToken = require('../utils/generateAccessToken')
const {successResponse, errorResponse} = require('../utils/defaultResponse')
const {body} = require("express-validator");
const generateUsername = require("../utils/generateUsername");
const {validationResult} = require('express-validator');
const {verify} = require("jsonwebtoken");

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

    try {
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

    const userLogedIn = await User.findOne({
        where: {
            email: req.body.email,
        }
    })
    if (!userLogedIn) {
        res.status(404).send({
            ...errorResponse,
            message: "User not found!"
        })
        return;
    }
    console.log("password ==> ", userLogedIn)
    console.log("password ==> ", userLogedIn.password)

    const hashedPass = userLogedIn.password
    if (!await bcrypt.compare(req.body.password, hashedPass)) {
        res.status(401).send({
            ...errorResponse,
            message: "Email & password doesnt match!"
        })
        return

    }
    console.log("---------> Login Successful")
    console.log("---------> Generating accessToken")
    const token = generateAccessToken({user: userLogedIn})
    res.send({
        ...successResponse,
        data: {
            user: userLogedIn,
            accessToken: token
        }
    })

}

const check = async (req, res) => {
    let tokenHeader = req.headers['authorization'];
    const token = tokenHeader.split(' ')[1];

    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                ...errorResponse,
                message : "Unauthorized!",
            });
        }
        res.send({
            ...successResponse,
            data: {
                user: decoded.user,
                accessToken: token,
                expired_at :  new Date(decoded.exp*1000)
            }
        })

    })

}



module.exports = {signUp, signIn,check}
