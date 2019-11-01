const {
    body
} = require('express-validator/check');

exports.registerValidators = [
    body('email').isEmail().withMessage('ВВедите корректный email'),
    body('password', 'Пароль не меньше 6 символов').isLength({
        min: 6,
        max: 56
    }).isAlphanumeric(),
    body('confirm').custom((value, {
        req
    }) => {
        if (value != req.body.password) {
            throw new Error('Пароли должны совпадать!')
        } else {
            return true
        }
    }),
    body('name', 'Имя не меньше 3 символов').isLength({
        min: 3,
        max: 10
    })


]