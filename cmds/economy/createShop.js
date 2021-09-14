const fs = require('fs');
const Discord = require('discord.js');
const shopMessage = require('../reaction/shop-react')
const economy = require('../../economy')
const language = require('../language/language')
const settings = require('../features/setting')
const shopSchema = require('../../schemas/shop-schema')
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const itemslist = require('../inventory/items')
const commandStats = require('../../Stats/commandStats')
const boticons = require('../reaction/boticons')
const inventory = require('../inventory/inventory');
module.exports = class CreateServerShopCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'createshop',
            aliases: ['opprettbutikk', 'neuereinkaufsladen', 'makeshop', 'newshop'],
            group: 'economy',
            memberName: 'createshop',
            description: 'create your own shop!',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple',
            format: '{JSON}',
            examples: ['#channel {"shop": "Shop Name", "items": [{Itemname: "Name of item", price: "Price of item"}]}'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        
        const setting = await settings.settingsguild(guild, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            commandStats.cmdUse(guildId, 'createshop')
            /*let msgjson = '\```json\n{'
            msgjson = msgjson + "\n \"" + 'test' + "\": \"" + 'test2' + "\","
                
            msgjson = msgjson.substring(0, msgjson.length - 1)
            msgjson = msgjson + "\n}\`\`\`"
            message.channel.send(msgjson);*/
            // Get JSON data
            //tempMsg(message.channel, '{"Shop": "Shop Name", "Items": {Itemname: "Name of item", Price: "Price of item"}}', 90)
            //let items = txt.substr(txt.indexOf('['), txt.indexOf(']')+1)
            const targetChannel = message.mentions.channels.first();
            if (!targetChannel) {
                tempMsg(message.channel, `${language(guild, 'CHANNEL')}`, 10)
                return
            }
            let txt = message.content
            txt = txt.toLowerCase()
            
            txt = txt.split(' ')
            txt.shift()
            txt.shift()
            txt = txt.join(' ')
            const test = [...txt].join('')
            //console.log(test)
            
            let shop = JSON.parse(txt)
            let items = []
            
            for (let i = 0; i < shop.items.length; i++) {
                let itemname = shop.items[i].name
                if (itemname in itemslist) {
                    //console.log('added ', shop.items[i].name)
                    items.push(shop.items[i])
                } else {
                    message.reply(`Item ${shop.items[i].name} does not exist.`)
                    return
                }
            }

            const shopname = shop.shop
            const channelId = targetChannel.id
            let result = await shopSchema.findOneAndUpdate({
                guildId,
            }, {
                guildId,
                channelId,
                shopname,
                items
            }, {
                upsert: true
            }).catch((err) => {
                console.log(c.red(err))
            })
            //if (channelId == result.channelId)
            if (!result) {
                result = await new shopSchema({
                    guildId,
                    channelId,
                    shopname: shopname,
                    items: shop.items
                }).save()
                tempMsg(message.channel, `${language(guild, 'SHOP_CREATE')}`, 10)
            } else {
                tempMsg(message.channel, `Shop successfully updated`, 10)
            }
        }
    }
}






