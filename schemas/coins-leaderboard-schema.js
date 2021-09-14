const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}

const coinsLeaderBoard = mongoose.Schema({ 
    guildId: reqString,
})

module.exports = mongoose.model('coins-leaderboard', coinsLeaderBoard)