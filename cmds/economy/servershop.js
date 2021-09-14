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
const boticons = require('../reaction/boticons')
const inventory = require('../inventory/inventory');
const commandStats = require('../../Stats/commandStats')
module.exports = class ServerShopCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'shop',
            aliases: ['shopping'],
            group: 'economy',
            memberName: 'shop',
            description: 'your own personal shop',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
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
        message.delete()
        const { guild } = message
        const guildId = guild.id
        
        const setting = await settings.settingsguild(guild, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            commandStats.cmdUse(guildId, 'shop')
            
            let result = await shopSchema.findOneAndUpdate({
                guildId,
            }, {
                guildId,
            }, {
                upsert: true
            }).catch((err) => {
                console.log(c.red(err))
            })
            if (!result) {
                return tempMsg(message.channel, `${language(guild, 'SHOP_NOTFOUND')} -createshop`, 10)
            }
            const options = []
            const shopname = result.shopname
            
            let shopembed = await new Discord.MessageEmbed()
                .setColor('ff4300')
                .setTitle(`${shopname} ${language(guild, 'SHOP_TITLE')}`)
            
            let i = 1
            for (let items in result.items) {
                let role = new MessageMenuOption()
                    .setLabel(result.items[items].name)
                    .setDescription(result.items[items].price)
                    .setValue(i)
                //console.log(result.items[items].name, result.items[items].price)
                shopembed.addField(`${result.items[items].name}`, `${result.items[items].price} ErlingCoins`)
                options.push(role)
                i++
            }
            const Menu = new MessageMenu()
                .setID('Shop')
                .setPlaceholder('Select')
                .addOptions(options)
                .setMaxValues(1)
                .setMinValues(1)
            
                
                shopembed.setImage("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans/26312799/264f2c3481add59321cb50e0ce7819f51211d659.gif")
    
            shopMessage(this.client, result.channelId, shopembed, Menu)

            /*const thread = await message.channel.threads.create({
                name: shopname,
                autoArchiveDuration: 60,
                reason: 'Shop'
            })*/
        }
    }
}