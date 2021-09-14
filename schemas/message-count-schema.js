const mongoose = require('mongoose')
const reqNumber = {
    type: Number,
    required: true,
    default: 0
}
const reqString = {
    type: String,
    required: true
}
const reqDate = {
    type: Date,
    required: true
}
const messageCountSchema = mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    messageCount: reqNumber,
})

module.exports = mongoose.model('message-counts', messageCountSchema)