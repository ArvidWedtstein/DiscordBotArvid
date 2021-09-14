const mongoose = require('mongoose')
const reqNumber = {
    type: Number,
    required: true
}
const reqString = {
    type: String,
    required: true
}
const reqDate = {
    type: Date,
    required: true
}
const reactionrole = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    messageId: reqString,
    roles: [{
        emoji: reqString,
        roleId: reqString
    }]
    
})

module.exports = mongoose.model('reaction-roles', reactionrole)