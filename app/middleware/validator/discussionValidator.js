const { check} = require("express-validator");
const validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('title', "title is required!").exists(),
                check('content', "content is required!").exists(),
            ]
        }
    }
}

module.exports = validate

