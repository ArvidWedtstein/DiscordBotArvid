const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const pollSchema = mongoose.Schema({
    pollId: reqString,
    messageId: reqString,
    guildId: reqString,
    question: reqString,
    expires: {
        type: Date,
        required: false,
    },
    current: {
        type: Boolean,
        required: true,
    },
    answers: {
        type: Object,
        required: false
    }
})


module.exports = mongoose.model('polls', pollSchema)