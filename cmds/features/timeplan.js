const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
const { MessageButton } = require('discord-buttons')
module.exports = class TimePlanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'timeplan',
            aliases: ['tp', 'ukeplan', 'up'],
            group: 'features',
            memberName: 'timeplan',
            description: 'timeplan',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
        })
    }

    async run(message, args) {
        //message.delete();
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'timeplan')
        const d = new Date()
        const dateformat = (d) => {
            let dformat = [
                d.getDate(),
                d.getMonth()+1,
                d.getFullYear()
            ].join('/');
            return dformat
        }
        
        const monthdays = {
            1: '31',
            2: '28',
            3: '31',
            4: '30',
            5: '31',
            6: '30',
            7: '31',
            8: '31',
            9: '30',
            10: '31',
            11: '30',
            12: '31'
        }
        
        const days = monthdays[d.getMonth()+1]
        let monthtxt = ''
        for (let i = 1; i < days; i++) {
            monthtxt += i;
            monthtxt += '-'
            if (i == 7) {
                monthtxt += '\n'
            } else if (i == 14) {
                monthtxt += '\n'
            } else if (i == 21) {
                monthtxt += '\n'
            } else if (i == 28) {
                monthtxt += '\n'
            }
        }


        
        //message.channel.send(monthtxt)
        function suffixes(number) {
            const converted = number.toString();

            const lastChar = converted.charAt(converted.length - 1);

            return lastChar == "1" ? 
            `${converted}st` : lastChar == "2" ?
            `${converted}nd` : lastChar == '3' ?
             `${converted}rd` : `${converted}th`
        }
        const toggle = new MessageButton()
            .setLabel(`${language(guild, 'TIMEPLAN_SWITCH')}`)
            .setStyle(3)
            .setID('1')
        const toggle2 = new MessageButton()
            .setLabel(`${language(guild, 'TIMEPLAN_SWITCH')}`)
            .setStyle(1)
            .setID('2')
        const close = new MessageButton()
            .setStyle(2)
            .setID('3')
            .setEmoji('❌')
        const attachment = new Discord.MessageAttachment('./img/Ukeplan.PNG', 'Ukeplan.PNG')
        const attachment2 = new Discord.MessageAttachment('./img/Ukeplan2.PNG', 'Ukeplan2.PNG')

            
        
        let msg = await message.channel.send({
            files: [attachment],
            buttons: [toggle, close]
        })
        this.client.on('clickButton', async (button) => {
            if (!button.message) return;
            button.reply.defer()
            if (button.clicker.user.id != message.author.id) return;
            if (button.id == '1') {
                button.message.delete()
                button.channel.send({
                    files: [attachment2],
                    buttons: [toggle2, close]
                })
            } else if (button.id == '2') {
                button.message.delete()
                button.channel.send({
                    files: [attachment],
                    buttons: [toggle, close]
                })
            }
            else if (button.id == '3') {
                button.message.delete()
                
            }
        });
    }
}