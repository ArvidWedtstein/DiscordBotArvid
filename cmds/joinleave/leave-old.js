const fs = require('fs');
const config = require('../../config.json')
const settings = require('../features/setting')
module.exports = async (client, Discord) => {
    var d = new Date();
    
    client.on('guildMemberRemove', async (member) => {
        const { guild } = member
        const setting = await settings.settingsguild(guild, 'welcome');
        if (setting == false) {
            // message.reply(`${language(guild, 'SETTING_OFF')} Welcome/Leave ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const channel = member.guild.channels.cache.find(channel => channel.name === 'new-slaves')
            if (!channel) {
                const name = 'new-members'
                member.guild.channels
                    .create(name, {
                        type: 'text',
                        permissionOverwrites: [
                            {
                                id: member.guild.id,
                                deny: ['SEND_MESSAGES'],
                            }
                        ]
                })
                .then(async (channel2) => {
                    const msg = `${member} 😕`
                    let embed = new Discord.MessageEmbed()
                        .setColor(config.botEmbedHex)
                        .setTitle('Goodbye')
                        .setDescription(msg)
                        .setThumbnail(member.user.avatarURL())
            
                    let messageEmbed = channel2.send(embed)
                })
                

            } else {
                const msg = `${member} 😕`
                let embed = new Discord.MessageEmbed()
                    .setColor(config.botEmbedHex)
                    .setTitle('Goodbye')
                    .setDescription(msg)
                    .setThumbnail(member.user.avatarURL())
        
                let messageEmbed = channel.send(embed)
            }
        }
    });
}