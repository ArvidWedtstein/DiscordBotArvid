const Discord = require('discord.js');
const fs = require('fs');
const settings = require('../features/setting')
module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        const { guild } = member
        if (!guild) {
            return
        }
        const setting = await settings.settingsguild(guild, 'antijoin');
        
        if (setting == false) {
            return
        } else if (setting == true) {
            const reason = 'Antijoin'
            member.kick(reason);
        }
    })
}
