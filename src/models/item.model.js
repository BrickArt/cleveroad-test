const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

schema.methods.getPublicFields = function () {
    let d = new Date(this.created_at);
    d = Math.round(+d / 1000);

    return {
        id: this._id.toString(),
        title: this.title,
        price: this.price,
        user_id: this.user_id,
        image: this.image,
        created_at: d
    };
};

exports.Item = mongoose.model("Item", schema);
