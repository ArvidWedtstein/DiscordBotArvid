const messageCountSchema = require("../../schemas/message-count-schema")
const economy = require('../../economy')
const inventory = require('../inventory/inventory');
module.exports = async (client, id, text, menu) => {
    const channel = await client.channels.fetch(id)
    menu = menu || ''
    channel.messages.fetch().then((messages) => {
        if (messages.size == 0) {
            channel.send(text, menu)
        } else {
            for (const message of messages) {
                //console.log(message.embeds[0].title, text.title)
                if (message[1].author.id != client.user.id) return
                if (!message[1].embeds[0]) return
                if (message[1].embeds[0].title == text.title) {
                    message[1].edit(text, menu)
                    client.on('clickMenu', async (m) => {
                        if (!m.clicker.user.bot) {
                            
                            const guild = message[1].guild
                            const guildId = guild.id;
                            const userId = m.clicker.user.id;
                            let price = ''
                            for (let i = 0; i <= Number(m.values[0]); i++) {
                                //console.log(Number(m.values[0]), i)
                                if (Number(m.values[0]) == i) {
                                    m.reply.defer()
                                    price = message[1].components[0].components[0].options[i-1].description

                                    const coinsToPay = price
                                    const coinsOwned = await economy.getCoins(guildId, userId);
                                    if (coinsOwned < coinsToPay) {
                                        
                                        m.clicker.user.send(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToPay} ErlingCoins!`)
                                        return
                                    } else if (coinsOwned >= coinsToPay) {
                                        let itemname = message[1].components[0].components[0].options[i-1].label
                                        const itemamount = 1;
                                        await economy.addCoins(
                                            guildId,
                                            userId,
                                            coinsToPay * -1
                                        )
                
                                        // Add item to users inventory
                                        await inventory.addItem(guildId, userId, itemname, itemamount);
                                    }
                                }
                            }  
                        }
                    })
                } 
            }
        }
    })
}