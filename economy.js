const mongo = require('./mongo')
const profileSchema = require('./schemas/profileschema')
const c = require('ansi-colors')
const coinsCache = {}

module.exports = (client) => {}

module.exports.addCoins = async (guildId, userId, coins) => {

            console.log('Running findOneAndUpdate(coins)')
            
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $inc: {
                    coins
                }
            }, {
                upsert: true
            }).catch((err) => {
                console.log(c.red(err))
            })
            if (!result) {
                let coins = 0;
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }
            //console.log('RESULT:', result)

            coinsCache[`${guildId}-${userId}`] = result.coins

            return result.coins
}
module.exports.setCoins = async (guildId, userId, coins) => {
            console.log('Settings coins')

            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $set: {
                    coins
                }
            }, {
                upsert: true,
                new: true,
            })

            //console.log('RESULT:', result)

            coinsCache[`${guildId}-${userId}`] = result.coins

            return result.coins
}
module.exports.getCoins = async (guildId, userId) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }
    console.log('Running findOne()')

    const result = await profileSchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let coins = 0;
    if (result) {
        coins = result.coins
    } else {
        console.log('Inserting a document')
        await new profileSchema({
            guildId,
            userId,
            coins
        }).save()
    }

    coinsCache[`${guildId}-${userId}`] = coins

    return coins 
            
}
module.exports.getColor = async (guildId, userId) => {

    const result = await profileSchema.findOne({
        guildId,
        userId
    })
    //console.log(result)
    let color = '#ff4300'
    let color2 = '';
    if (result) {
        color2 = result.color
    } else {
        console.log('Inserting a document')
        await new profileSchema({
            guildId,
            userId,
            color
        }).save()
    }

    return color2
            
}
