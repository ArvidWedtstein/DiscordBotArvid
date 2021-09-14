const mongoose = require('mongoose')

const playlistSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    playlist: {
        type: [Object],
        required: true,
    }

})

module.exports = mongoose.model('playlist', playlistSchema)