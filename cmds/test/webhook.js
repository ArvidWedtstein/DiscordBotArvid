const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class WebhookCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'webhook',
            group: 'features',
            memberName: 'webhook',
            description: 'create a webhook',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const channel = message.channel

    
            // Get JSON data
        const json = JSON.parse(args.join(' '))
        console.log(json)
        try {
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.first();

            await webhook.send('', {
                username: 'IG9TE',
                avatarURL: 'https://cdn.discordapp.com/avatars/324179030247079937/177c034a8dea852f99db858463b81338.webp',
                embeds: [json],
            });
        } catch (error) {
            console.error('Error trying to send: ', error)
            tempMsg(message.channel, `Invalid JSON ${error.message}`, 5)
        }
    }
}