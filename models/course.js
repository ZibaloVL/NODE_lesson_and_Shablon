const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

class Course {
    constructor(title, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.id = uuid();
    }

    toJSON() {
        return ({
            title: this.title,
            price: this.price,
            image: this.image,
            id: this.id
        })
    }

    async save() {
        var courses = await Course.getAll();
        console.log('courses', courses);
        courses.push(this.toJSON());
        console.log('Courses', courses);
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }

            )
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }
    static async getById(id) {
        let courses = await Course.getAll();
        return courses.find(c => c.id === id);

    }
}

module.exports = Course