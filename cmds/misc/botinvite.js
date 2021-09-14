const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class BotInviteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['botinvite'],
            group: 'misc',
            memberName: 'invite',
            description: 'invite me to your server',
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const guildId = message.guild.id

        commandStats.cmdUse(guildId, 'invite')
        let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle(`Invite link for **${this.client.user.username}**`)
            .setThumbnail(this.client.user.avatarURL())
            .addField('Link:', '[https://discord.com/api/oauth2/authorize?client_id=787324889634963486&permissions=0&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D787324889634963486%26scope%3Dbot&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.notifications.read%20applications.builds.upload%20messages.read%20webhook.incoming%20bot%20rpc.activities.write%20rpc.voice.write%20rpc.voice.read%20applications.builds.read%20applications.commands%20applications.store.update%20applications.entitlements%20activities.read%20activities.write%20relationships.read](https://discord.com/api/oauth2/authorize?client_id=787324889634963486&permissions=0&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D787324889634963486%26scope%3Dbot&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.notifications.read%20applications.builds.upload%20messages.read%20webhook.incoming%20bot%20rpc.activities.write%20rpc.voice.write%20rpc.voice.read%20applications.builds.read%20applications.commands%20applications.store.update%20applications.entitlements%20activities.read%20activities.write%20relationships.read)')
        // https://discord.com/api/oauth2/authorize?client_id=787324889634963486&permissions=0&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D787324889634963486%26scope%3Dbot&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.notifications.read%20applications.builds.upload%20messages.read%20webhook.incoming%20bot%20rpc.activities.write%20rpc.voice.write%20rpc.voice.read%20applications.builds.read%20applications.commands%20applications.store.update%20applications.entitlements%20activities.read%20activities.write%20relationships.read
        let messageEmbed = message.channel.send(embed);
    }
}