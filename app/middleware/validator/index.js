const { validationResult} = require('express-validator');
const { errorResponse} = require('../../utils/defaultResponse')

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({...errorResponse, message: errors.array()[0].msg})
    };
};

module.exports = validate
