const {body, check} = require("express-validator");
const validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('title', 'title is required!').exists(),
                check('content', "content is required!").exists(),
                check('region', "region is required!").exists(),
                check('school_name', "school_name is required!").exists(),
                check('case_date', "case_date is required and must be a date with format yyyy-mm-dd!")
                    .exists()
                    .isDate({
                    format : 'yyyy-mm-dd'}),
                check('report_as', "report_as is required!").exists(),
            ]
        }
    }
}

module.exports = validate

