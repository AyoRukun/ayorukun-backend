const authController = require('../controllers/authController')
const reportController = require('../controllers/reportController')
const discussionController = require('../controllers/discussionController')
const regionController = require('../controllers/regionController')
const verifyToken = require('../middleware/verifyToken')
const authValidator = require('../middleware/validator/authValidator')
const discussionValidator = require('../middleware/validator/discussionValidator')
const validate = require("../middleware/validator/index");



const useApiRoute = (app) => {
    //     auth
    app.post('/auth/check', [ verifyToken], authController.check);
    app.post('/auth/register', [ validate(authValidator("register"))], authController.signUp);
    app.post('/auth/login', [ validate(authValidator("login"))], authController.signIn);

    // report
    app.post('/reports',  [verifyToken,  ], reportController.create);
    app.get('/reports', reportController.index);
    app.post(`/reports/:id/comments`,  [verifyToken,  ], reportController.createComment);
    app.get(`/reports/:id`, reportController.getDetailReport);
    app.post(`/reports/:id/like`, [verifyToken,  ], reportController.likeReport);
    app.post(`/reports/:id/unlike`,[verifyToken,  ], reportController.unlikeReport);

    app.post(`/reports/:id/comments/:commentId/like`,  [verifyToken,  ], reportController.likeComment);
    app.post(`/reports/:id/comments/:commentId/unlike`,  [verifyToken,  ], reportController.unlikeComment);

    // discussion
    app.post('/discussions',  [verifyToken, [ validate(discussionValidator("create"))] ], discussionController.create);
    app.get('/discussions', discussionController.index);
    app.post(`/discussions/:id/comments`,  [verifyToken,  ], discussionController.createComment);
    app.get(`/discussions/:id`, discussionController.getDetailReport);
    app.post(`/discussions/:id/like`, [verifyToken,  ], discussionController.likeDiscussion);
    app.post(`/discussions/:id/unlike`,[verifyToken,  ], discussionController.unlikeDiscussion);
    app.post(`/discussions/:id/comments/:commentId/like`,  [verifyToken,  ], discussionController.likeDiscussionComment);
    app.post(`/discussions/:id/comments/:commentId/unlike`,  [verifyToken,  ], discussionController.unlikeDiscussionComment);



    //region
    app.get('/region/province-regency', [verifyToken] ,regionController.searchProvinceRegency)

}

module.exports = useApiRoute
