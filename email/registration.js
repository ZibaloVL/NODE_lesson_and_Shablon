const keys = require('../keys/index.js');
 
module.exports = function (email) {
    return {
        to: email ,
        from: keys.EMAIL_FROM,
        subject: 'Акаунд создан',
        html: `
            <h1> welcome in course</h1>
            <a href=${keys.BASE_URL}> НА ГЛАВНУЮ</a>
        `

    }
}