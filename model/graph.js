const { model, Schema } = require('mongoose')

const schema = new Schema({
    y: {
        type: String,
        required: true
    }
})

module.exports = model('Graph', schema)