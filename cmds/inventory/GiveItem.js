const fs = require('fs');
const Discord = require('discord.js');
const inventorySchema = require('../../schemas/inventory-schema')
const inventory = require('./inventory')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const items = require('./items')
const commandStats = require('../../Stats/commandStats');
const temporaryMessage = require('../misc/temporary-message');

module.exports = class RemoveItemCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'giveitem',
	        aliases: ['itemgive', 'gift', 'give'],
            group: 'inventory',
            memberName: 'giveitem',
            description: 'give an item with a user',
            userPermissions: ['STREAM'],
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
            examples: ['tradeitem <user> <itemname> <amount>']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, author } = message
        const user = message.guild.member(message.mentions.users.first())
        if (!user) {
            return temporaryMessage(message.channel, language(guild, 'VALID_USER'));
        }
        args.shift()
       
        const guildId = message.guild.id
        const userId = user.id
        const { id: authorId } = author;
        commandStats.cmdUse(guildId, this.memberName);  
        

        const itemname = args[0].toLowerCase();
        const amount = args[1];
        if (isNaN(amount)) {
            message.reply(`${language(guild, 'CLEAR_NaN')}`)
            return
        }

        

        if (itemname in items) {
            inventory.removeItem(guildId, userId, itemname, amount, authorId) 
        } else {
            //message.reply(`The item "${itemname}" does not exist. Use ${items}`);
            message.reply(`${language(guild, 'ADDITEM_NOEXIST')} ${items}`);
        }
        
    }
}