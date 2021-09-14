const levels = require('./userlevels.json');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class LevelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'levels',
            aliases: ['lvls'],
            group: 'level',
            memberName: 'levels',
            description: 'get the xp needed for each level',
            guildOnly: true,
            userPermissions: ['SEND_TTS_MESSAGES']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        commandStats.cmdUse(guild.id, 'levels')
        let leveltxt = ''


        for (const [key, value] of Object.entries(levels)) {
            if (!guild.roles.cache.find(r => r.id === value)) {
                return;
            }
            
            //console.log(`${key}`)
            let level10 = `${key / 10}`
            let levelxp = `${level10 * level10  * 200}`
            //console.log(levelxp)
            leveltxt += `Level **${key}**: ${levelxp}XP\n`;
            
        }
        //let mybutton = new MessageButton().setStyle("green").setID("1").setLabel("Enable")
        //let mybutton2 = new MessageButton().setStyle("red").setID("2").setLabel("Disable")
        let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle('Levels')
        .addField('Levels', leveltxt)
        
        let mybuttonsmsg = await message.channel.send(embed)
        /*const mybuttonsmsg = await message.channel.send('test', { embed: embed, buttons: [mybutton] })
        const collector = mybuttonsmsg.createButtonCollector((button) => button.clicker.user.id === message.author.id, {time: 60e3});
        collector.on("collect", (b) => {
            console.log(b.id)
            b.defer();
            if (b.id == "1") {
                mybuttonsmsg.edit('test', { embed: embed, buttons: [mybutton2] })
            } else if (b.id == "2") {
                mybuttonsmsg.edit('test', { embed: embed, buttons: [mybutton] })
            }
        })*/
        /*this.client.on("clickButton", (b) => {
            if (b.id == "1") {
                b.defer();
                mybuttonsmsg.edit({ embed: embed, buttons: [mybutton2] })
            } else if (b.id == "2") {
                b.defer();
                mybuttonsmsg.edit({ embed: embed, buttons: [mybutton] })
            }
        })*/
    }   
}
