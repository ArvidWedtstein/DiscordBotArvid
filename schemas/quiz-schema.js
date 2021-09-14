const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    questions: {
        type: [Object],
        required: true,
    }
})

module.exports = mongoose.model('questions', quizSchema)