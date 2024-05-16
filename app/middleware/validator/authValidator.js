const {body,checkSchema} = require("express-validator");
const User = require('../../models').User

module.exports = (method) => {
    switch (method) {
        case 'register': {
            return  checkSchema({
                email: {
                    notEmpty : true ,
                    isEmail : {
                        errorMessage : "Invalid email!"
                    },
                    normalizeEmail: false,
                    custom: {
                        options: value => {
                            return User.findOne({
                                where: {
                                    email: value
                                }
                            }).then(user => {
                                if (!!user) {
                                    return Promise.reject('Email already in use!')
                                }
                            })
                        }
                    }
                },
                password: {
                    notEmpty: true,
                    errorMessage: "Password cannot be empty",
                },
            })
        }
        case 'login': {
            return [
                body('email', 'Invalid email!').exists().isEmail(),
                body('password', "Password is required!").exists(),
            ]
        }

    }
}
