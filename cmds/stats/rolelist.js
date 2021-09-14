const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class RoleListCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'rolelist',
            group: 'stats',
            memberName: 'rolelist',
            description: 'See all of the servers roles',
            userPermissions: ['SEND_MESSAGES']
        })
    }

    async run(message, args) {
        const { guild } = message
        const { id: guildId } = guild
        let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(", \n");
            if (rolemap.length > 1024) rolemap = "To many roles to display";
            if (!rolemap) rolemap = "No roles";
        const embed2 = new Discord.MessageEmbed()
        .setTitle('Server Roles')
        .addField("Role List" , rolemap)
        message.channel.send(embed2);
        commandStats.cmdUse(guildId, 'rolelist')
    }
}



