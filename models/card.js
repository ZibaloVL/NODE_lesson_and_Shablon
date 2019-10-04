const fs = require('fs');
const path = require('path');


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
);

class Card {

    static async add(course) {
        console.log('course__', course);

        const card = await Card.fetch();
        console.log("card__", card);

        const idx = card.courses.findIndex(c => c.id === course.id);
        console.log("idx", idx);
        const candidate = card.courses[idx]; // ?? -1 если не находит 
        if (candidate) {
            console.log("курс уже есть");
            card.courses[idx].count++;
        } else {
            // нужно добавить
            course['count'] = 1;
            card.courses.push(course);
        }

        card.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })

        })
    }

    static fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                }
            })
        })
    }

    static async remove(id) {
        const card = await Card.fetch();
        console.log('card__', card);
        const idx = card.courses.findIndex(c => c.id === id);
        const curse = card.courses[idx];
        if (curse.count === 1) {
            //remove
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            //change
            card.courses[idx].count--;
        }
        card.price -= card.courses[idx].price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })

        })

    }

}

module.exports = Card