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

    },
    password: {
        type: String,
        required: true
    },
    avatarUrl: String,
    resetToken: {
        type: String
    },
    resetTokenExp: {
        type: Date
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

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === id.toString();
    })
    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() != id.toString())
    } else {
        items[idx].count--;
    }
    this.cart = {
        items
    }
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    }
    return this.save();
}

module.exports = model('User', userSchema);