const userController = require('../controllers/userController')
const reportController = require('../controllers/reportController')
const verifyToken = require('../middleware/verifyToken')
const useApiRoute = (app) => {
    //     auth
    app.post('/auth/register', [ userController.validate("register")], userController.signUp);
    app.post('/auth/login', [ userController.validate("login")], userController.signIn);

    // bully-report
    app.post('/reports',  [verifyToken], reportController.create);


}

module.exports = useApiRoute
