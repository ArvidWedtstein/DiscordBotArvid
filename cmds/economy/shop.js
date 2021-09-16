const fs = require('fs');
const Discord = require('discord.js');
const firstMessage = require('../reaction/first-message')
const economy = require('../../economy')
const language = require('../language/language')
const settings = require('../features/setting')
const inventory = require('../inventory/inventory');
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
module.exports = async (client) => {
        const channelId = '811947359692652554';
        //const channelId = client.channels.cache.get('811947359692652554');
        const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName)
        
        

        const guild2 = '524951977243836417'
        const guild3 = await client.guilds.fetch('524951977243836417')
        const setting = await settings.settingsguild(guild2, 'money');
        if (setting == false) {
            //message.reply(`${language(guild3, 'SETTING_OFF')} Economy ${language(guild3, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {

            const price = {
                gifflar: 50,
                vip: 200,
                Wehrmacht: 200
            }
            const emojis = {
                vip: 'VIP',
                Wehrmacht: 'Tysk Territorium'
            }
            const extraemoji = ['gifflar']
            let options1 = new MessageMenuOption()
                .setLabel('Gifflar')
                .setValue("1")
                .setDescription(`50 Erlingcoins`)
                .setDefault()
                .setEmoji('844852887389863947')
            let options2 = new MessageMenuOption()
                .setLabel('VIP')
                .setValue("2")
                .setDescription(`200 Erlingcoins`)
                .setDefault()
                .setEmoji('🍀')
            let options3 = new MessageMenuOption()
                .setLabel('Tysk Territorium')
                .setValue("3")
                .setDescription(`200 Erlingcoins`)
                .setDefault()
                .setEmoji("834394303035211796")
            let select = new MessageMenu()
                .setID('Shop')
                .setMaxValues('1')
                .setMinValues('1')
                .setPlaceholder('Select Item')  
                .addOptions([options1, options2, options3])


            
            let shopembed = await new Discord.MessageEmbed()
                .setColor('ff4300')
                .setTitle(`${language(guild3, 'SHOP_TITLE')}`)
                .setDescription(`${language(guild3, 'SHOP_DESCRIPTION')}`)
                .setImage("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans/26312799/264f2c3481add59321cb50e0ce7819f51211d659.gif")
                .addField('VIP (🍀)', `${price.goolag} ErlingCoins\n${language(guild3, 'SHOP_VIP')}`)
                .addField(`${language(guild3, 'SHOP_GERMANTERRITORY1')} (<:Wehrmacht:818478749007478806>)`, `${price.Wehrmacht} ErlingCoins\n${language(guild3, 'SHOP_GERMANTERRITORY2')}`)
                .addField(`Gifflar (<:gifflar:844852887389863947>)`, `${price.gifflar} ErlingCoins\n${language(guild3, 'SHOP_GIFFLAR')}`)
            const reactions = []
    
            /*for (const key in emojis) {
                const emoji = getEmoji(key)
                reactions.push(emoji)
    
                const role = emojis[key]
            }*/
            /*for (i = 0; i < extraemoji.length; i++) {
                const emoji = getEmoji(extraemoji[i])
                reactions.push(emoji)
            }*/
    
            firstMessage(client, channelId, shopembed, reactions, select)
    
            client.on('clickMenu', async (menu) => {
                if (!menu.clicker.user.bot) {
                    menu.reply.defer();
                    if (menu.message.channel.id != channelId) return;
                    const guild = guild3
                    const guildId = guild.id;
                    const userId = menu.clicker.user.id;
                    let emoji = ''
                    if (menu.values[0] == '1') {
                        emoji = 'gifflar'
                    } else if (menu.values[0] == '2') {
                        emoji = 'vip'
                    } else if (menu.values[0] == '3') {
                        emoji = 'Wehrmacht'
                    }  
                    
                    let roleName = ''
                    let role = ''
                    const pricetopay = price[emoji]
        
                    
                    const member = guild.members.cache.find(member => member.id === userId)
                    
                    const coinsToPay = pricetopay
                    const coinsOwned = await economy.getCoins(guildId, userId);
                    //console.log(coinsOwned)
                    //const coinsOwned = 1000;
                    if (coinsOwned < coinsToPay) {
                        //console.log('not enough money')
                        member.send(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToPay} ErlingCoins!`)
                        return
                    } else if (coinsOwned >= coinsToPay) {
                        switch (menu.values[0]) {
                            case '1': // Gifflar
                                const itemname = 'gifflar'
                                const itemamount = 1;
                                await economy.addCoins(
                                    guildId,
                                    userId,
                                    coinsToPay * -1
                                )
        
                                // Add gifflar to users inventory
                                await inventory.addItem(guildId, userId, itemname, itemamount);
                                break;
                            case '2': // VIP
                                roleName = emojis[emoji]
                                role = guild.roles.cache.find(role => role.name === roleName)
                                if (!role) {
                                    return;
                                }   
                                await economy.addCoins(
                                    guild.id,
                                    member.id,
                                    coinsToPay * -1
                                )
                    
                                member.roles.add(role) // Add VIP role
                                break;
                            
                            case '3': // German Territory
                                roleName = emojis[emoji]
                                role = guild.roles.cache.find(role => role.name === roleName)
                                if (!role) {
                                    return;
                                }   
                                //await reaction.users.remove(user.id);
                                await economy.addCoins(
                                    guild.id,
                                    member.id,
                                    coinsToPay * -1
                                )
                
                                member.roles.add(role)
                                break;
                        }
                    }
                }
            })
            /*client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
    
                    if (reaction.message.channel.id == channelId) {
                        const { guild } = reaction.message
                        const guildId = guild.id;
                        const userId = user.id;
                        // False = role True = item
                        handleReaction(reaction, user, true)
                        
                    } else {
                        return;
                    }
            });
            const handleReaction = async (reaction, user, add) => {
                console.log('handlereaction')
                if (user.bot) {
                    return;
                }
                const { guild } = reaction.message
                const guildId = guild.id;
                const userId = user.id;
                const emoji = reaction._emoji.name
                const roleName = emojis[emoji]
                
                const pricetopay = price[emoji]
    
                const role = guild.roles.cache.find(role => role.name === roleName)
                const member = guild.members.cache.find(member => member.id === user.id)
                
                const coinsToPay = pricetopay
                const coinsOwned = await economy.getCoins(guildId, userId);
                //console.log(coinsOwned)
                //const coinsOwned = 1000;
                if (coinsOwned < coinsToPay) {
                    console.log('not enough money')
                    await reaction.users.remove(user.id);
                    member.send(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToPay} ErlingCoins!`)
                    return
                } else if (coinsOwned >= coinsToPay) {
                    switch (reaction._emoji.name) {
                        case 'goolag':
                            if (!roleName) {
                                return;
                            }   
                            if (add) {
                                //console.log('add')
                                //await reaction.users.remove(user.id);
                                await economy.addCoins(
                                    guild.id,
                                    member.id,
                                    coinsToPay * -1
                                )
                
                                member.roles.add(role)
                            } else {
                                member.roles.remove(role)
                            }
                            break;
                        case 'Wehrmacht':
                            if (add) {        
                                if (!roleName) {
                                    return;
                                }   
                                //await reaction.users.remove(user.id);
                                await economy.addCoins(
                                    guild.id,
                                    member.id,
                                    coinsToPay * -1
                                )
                
                                member.roles.add(role)
                            } else {
                                member.roles.remove(role)
                            }
                            break;
                        case 'gifflar': 
                            //console.log('gifflar')  
                            await reaction.users.remove(user.id);
                            const itemname = 'gifflar'
                            const itemamount = 1;
                            await economy.addCoins(
                                guildId,
                                userId,
                                coinsToPay * -1
                            )
    
                            await inventory.addItem(guildId, userId, itemname, itemamount);
                            break;
                    }
                }
            }*/
        }
}





