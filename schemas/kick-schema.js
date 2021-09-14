const mongoose = require('mongoose')

const kickSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    kicks: {
        type: [Object],
        required: true,
    }
})

module.exports = mongoose.model('kicks', kickSchema)