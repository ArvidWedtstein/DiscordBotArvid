const inventorySchema = require('../../schemas/inventory-schema')
const inventory = require('./inventory')
module.exports = async (client) => {
    client.on('message', async (message) => {
        if (message.author.bot) {
            return;
        }
        if (!message.guild) return;
        const { content, guild, author } = message
        const guildId = guild.id
        const userId = author.id
        const extraemoji = ['gifflar']

        const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName)

        const gifflaremoji = getEmoji('gifflar')
        const array = []
        if (content.includes('<:gifflar:844852887389863947>')) {
            
            //console.log('GIFFLAR HAS BEEN SUMMONED')
            const result = await inventorySchema.findOne({
                guildId,
                userId,
            })
            if (result == null) {
                message.delete()
            } else {
                for (const item of result.items) {
                    const { name } = item
                    if (name == 'gifflar') {
                        array.push(name)
                    }
                    
                }
                if (array.includes('gifflar')) {
                    inventory.removeItem(guildId, userId, 'gifflar', 1)
                    //console.log(array.length)
                    var returneditems = array.length - 1
                    /*for (let i = 0; i < returneditems; i++) {
                        array.pop()
                    }*/
                    //console.log(array.length)
                    //console.log(returneditems)
                    inventory.addItem(guildId, userId, 'gifflar', returneditems + 1);
                    return;
                } else {
                    message.delete();
                    author.send(`${language(guild, 'GIFFLAR_NOPERM')}`)
                }
            }
            
        }
    })
}
