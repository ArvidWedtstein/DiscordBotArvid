const mongo = require('../mongo')
const swearSchema = require('../schemas/swear-schema')
module.exports = (client, Discord) => {
    client.on('message', async (message) => {
        
        const { guild } = message
        if (!guild) {
            return
        }
        const guildId = guild.id;  

        const userId = message.author.id;
        const results = await swearSchema.findOne({
            guildId,
            userId
        })
        if (!results) {
            return
        }
        //console.log(results.swear.length)
        const times = 3;
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (results.swear.length == times) {

            message.member.roles.add(muteRole)
            let embed = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setAuthor(`${message.author.username}` + ` has been muted.`, `${message.author.displayAvatarURL()}`)
                .addField('Time: ', `5min`)
                .setThumbnail('attachment://muteImg.jpg')
                .setTimestamp()
                .setFooter(`Muted by AutoStaff.`, ``)
            let messageEmbed = message.channel.send(embed);
            console.log(results.swear.length)
            setTimeout(function(){ 
                message.member.roles.remove(muteRole);
            }, 300*1000);
        } else if (results.swear.length == times + 3) {
            console.log('warn')
        } else if (results.swear.length >= times + 6) {
            console.log('BAN')
            const reason = 'Use of to many unappropriate words.'
            message.member.ban({reason: `${reason}`});
        }
    })
}