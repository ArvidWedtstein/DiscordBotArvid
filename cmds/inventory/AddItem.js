const fs = require('fs');
const Discord = require('discord.js');
const inventorySchema = require('../../schemas/inventory-schema')
const inventory = require('./inventory')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const items = require('./items')
module.exports = class AddItemCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'additem',
	        aliases: ['itemadd'],
            group: 'inventory',
            memberName: 'additem',
            description: 'add a item to a user',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const user = message.guild.member(message.mentions.users.first() || message.author)
        const guildId = message.guild.id
        const userId = user.id  
        args.shift()
        commandStats.cmdUse(guildId, 'additem')
        //let argsWithoutMentions = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
        const itemname = args[0].toLowerCase();
        const amount = args[1];
        if (isNaN(amount)) {
            message.reply(`${language(guild, 'CLEAR_NaN')}`)
            return
        }

        
        let icon = '';
        if (message.attachments.first()) {
            icon = message.attachments.first().url;
        } else {
            icon = ''
        }
        if (itemname in items) {
            inventory.addItem(guildId, userId, itemname, amount) 
        } else {
            //message.reply(`The item "${itemname}" does not exist. Use ${items}`);
            message.reply(`${language(guild, 'ADDITEM_NOEXIST')} ${items}`);
        }
        
    }
}