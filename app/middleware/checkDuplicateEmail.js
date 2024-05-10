const User = require('../models').User

const checkDuplicateEmail = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user) {
        res.status(409).send({
            success: false,
            message: "Email already taken!"
        });
        return;
    }
    next();
}




module.exports = checkDuplicateEmail
