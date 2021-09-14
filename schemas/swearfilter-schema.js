const mongoose = require('mongoose')

const swearfilterSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    swearwords: {
        type: [String],
        required: true,
    }
})

module.exports = mongoose.model('swearwords', swearfilterSchema)