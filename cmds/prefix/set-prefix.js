const commandPrefixSchema = require('../../schemas/command-prefix-schema')
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class SetPrefixCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setprefix',
            group: 'prefix',
            memberName: 'setprefix',
            description: 'sets server prefix',
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        const guildId = message.guild.id
        const prefix = args[0]
        const test = await commandPrefixSchema.findOneAndUpdate({
            _id: guildId
        }, {
            _id: guildId,
            prefix,
        }, {
            upsert: true
        })
        console.log(test)
        message.reply(`My prefix is now ${prefix}`)
    }
}