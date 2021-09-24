const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const profileSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 10,
    },
    birthday: {
        type: String,
        default: '1/1',
    },
    color: {
        type: String,
        default: '#ff4300'
    },
    joinedDate: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('profiles', profileSchema)