const keys = require('../keys/index.js');

module.exports = function (email) {
    return {
        to: email,
        from: 'sweetsons22@gmail.com',
        subject: 'Акаунд создан',
        html: `<h1> welcome in course</h1>`
    }
}