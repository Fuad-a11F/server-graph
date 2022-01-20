const { model, Schema } = require('mongoose')

const roomSchema = new Schema({
    room: {
        type: String,
        required: true
    },
    user: [{
        ref: 'Users',
        type: Schema.Types.ObjectId
    }]

})

module.exports = model('Rooms', roomSchema)