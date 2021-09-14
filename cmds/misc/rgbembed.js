const config = require('../../config.json')
const fs = require('fs');
const Discord = require('discord.js');
const commandStats = require('../../Stats/commandStats')
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class RGBembedCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'rgbembed',
            group: 'misc',
            memberName: 'rgbembed',
            description: 'rgbembed',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'rgbembed')
        var colors = ['#206BA4','#BBD9EE','#EBF4FA','#C0C0C0','#E7E4D3','#F1EFE2','#52ADDA','#68B8DF','#DBDBDB','#AACD4B','#C5AE87'];
        var curcolor = 0;
        
        //picks random color from array, different from current one
        function pickColor(){
            var rand = Math.floor(Math.random() * 11);
            if (rand == curcolor){
                pickColor();
            }
            else { 
                curcolor = rand;
                return colors[rand];
            }
        }
        const embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle('Test')
        let messageembed = message.channel.send(embed).then((message) => {
            setInterval(() =>{
                var color = pickColor()
                console.log(color)
                let embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle('RGB')
                message.edit(embed);
            }, 3000)
        })
    }
}