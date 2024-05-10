const userController = require('../controllers/userController')
const reportController = require('../controllers/reportController')
const checkDuplicateEmail = require('../middleware/checkDuplicateEmail')
const verifyToken = require('../middleware/verifyToken')
const useApiRoute = (app) => {
    //     auth
    app.post('/auth/register', [checkDuplicateEmail], userController.signUp);
    app.post('/auth/login',  userController.signIn);

    // bully-report
    app.post('/reports',  [verifyToken], reportController.create);


}

module.exports = useApiRoute
