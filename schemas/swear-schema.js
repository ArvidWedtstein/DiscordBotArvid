const mongoose = require('mongoose')

const swearSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    swear: {
        type: [Object],
        required: true,
    }
})

module.exports = mongoose.model('swear', swearSchema)