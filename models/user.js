const {
    Schema,
    model
} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }]
    }
})

userSchema.methods.addTocart = function (course) {
    const cloneItems = [...this.cart.items];
    const idx = cloneItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })
    // console.log('course__', course);
    // console.log('idx', idx);
    if (idx >= 0) {
        cloneItems[idx].count++;
    } else {
        cloneItems.push({
            count: 1,
            courseId: course._id
        })
    }
    this.cart = {
        items: cloneItems
    };
    return this.save();
}

module.exports = model('User', userSchema);