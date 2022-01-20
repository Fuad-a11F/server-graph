const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = model('Users', userSchema)