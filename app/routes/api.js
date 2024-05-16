const authController = require('../controllers/authController')
const reportController = require('../controllers/reportController')
const regionController = require('../controllers/regionController')
const verifyToken = require('../middleware/verifyToken')
const authValidator = require('../middleware/validator/authValidator')
const validate = require("../middleware/validator/index");



const useApiRoute = (app) => {
    //     auth
    app.post('/auth/check', [ verifyToken], authController.check);
    app.post('/auth/register', [ validate(authValidator("register"))], authController.signUp);
    app.post('/auth/login', [ validate(authValidator("login"))], authController.signIn);

    // report
    app.post('/reports',  [verifyToken,  ], reportController.create);

    //region
    app.get('/region/province-regency', [verifyToken] ,regionController.searchProvinceRegency)

}

module.exports = useApiRoute
