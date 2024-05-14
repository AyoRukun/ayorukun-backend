const {body} = require("express-validator");
const validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                body('email', 'Invalid email!').exists().isEmail(),
                body('password', "Password is required!").exists(),
            ]
        }
    }
}
