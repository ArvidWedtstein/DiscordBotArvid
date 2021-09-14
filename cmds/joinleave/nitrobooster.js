module.exports = (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const hadRole = oldMember.roles.cache.find(role => role.name === 'Nitro Booster');
        const hasRole = newMember.roles.cache.find(role => role.name === 'Nitro Booster');
      
        if (!hadRole && hasRole) {
            const guild = newMember.guild;
            let embed = new Discord.MessageEmbed()
                .setColor(config.botEmbedHex)
                .setTitle(`Server Boost`)
                .setDescription(`${newMember} ${language(guild, 'SERVER_BOOST')}`)
                .setThumbnail(newMember.avatarURL())
            newMember.guild.channels.get('715529449357180960').send(embed);
        }
      
        // if you want to check which members are boosted, you can check how many have the `Nitro Booster` role:
        
      });
      
}