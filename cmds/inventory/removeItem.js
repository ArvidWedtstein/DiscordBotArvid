const fs = require('fs');
const Discord = require('discord.js');
const inventorySchema = require('../../schemas/inventory-schema')
const inventory = require('./inventory')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const items = require('./items')
const commandStats = require('../../Stats/commandStats')
module.exports = class RemoveItemCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'removeitem',
	        aliases: ['itemremove'],
            group: 'inventory',
            memberName: 'removeitem',
            description: 'remove an item from your inventory',
            userPermissions: ['SEND_MESSAGES'],
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
            examples: ['removeitem <itemname> <amount>']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        let user = message.guild.member(message.author)
        if (user.hasPermission("ADMINISTRATOR")) {
            user = message.guild.member(message.mentions.users.first() || message.author)
            args.shift()
        }
       
        const guildId = message.guild.id
        const userId = user.id
        commandStats.cmdUse(guildId, 'removeitem')  
        

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
            inventory.removeItem(guildId, userId, itemname, items.icon, amount) 
        } else {
            //message.reply(`The item "${itemname}" does not exist. Use ${items}`);
            message.reply(`${language(guild, 'ADDITEM_NOEXIST')} ${items}`);
        }
        
    }
}