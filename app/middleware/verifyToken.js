const jwt = require("jsonwebtoken");
const {errorResponse} = require('../utils/defaultResponse')

const verifyToken = (req, res, next)=> {
    console.log("req.headers",req.headers)
    let tokenHeader = req.headers['authorization'];

    if (!tokenHeader){
        return res.status(401).send({
            ...errorResponse,
            message: "Unauthorized!",
        });
    }
    if (tokenHeader.split(' ')[0] !== 'Bearer') {
        return res.status(401).send({
            ...errorResponse,
            message: "Incorrect token format",
        });
    }

    const token = tokenHeader.split(' ')[1];
    console.log("token", token)
    if (!token) {
        return res.status(401).send({
            ...errorResponse,
            message: "No token provided!",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                ...errorResponse,
                message : "Unauthorized!",
            });
        }
        req.user = decoded.user;
        console.log("user Decoded", req.user)
        next();
    });
};

module.exports = verifyToken
