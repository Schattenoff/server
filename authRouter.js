const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./authMiddleware');

router.post('/sign-up',[
    check('username', "Имя пользователя не может быть пустым!").notEmpty(),
    check('email', "Некорректная почта!").isEmail(),
    check('password', "Пароль должен быть не меньше 6 символов").isLength({min: 6})
], controller.registration);
router.post('/sign-in', controller.login);
router.post('/add-events', authMiddleware, controller.addEvent);
router.post('/delete-event', authMiddleware, controller.deleteEvent);
router.get('/calendar', authMiddleware, controller.getUserName);
router.get('/events', authMiddleware, controller.getEvents);
router.get('/work', controller.getWork);
module.exports = router