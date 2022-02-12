const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats');
const currentTime = require('../../Stats/currentTime');
module.exports = class SkoleTimerCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'timer',
            aliases: ['skoletimer', 'time'],
            group: 'features',
            memberName: 'timer',
            description: 'skoletimene for dagen',
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
            guildOnly: true,
            guarded: false
        })
    }

    async run(message, args) {
        const { guild, channel, author } = message;
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);

        const timer = {
            "Monday": [
                { "fag": "Samfunnsfag", "start": "0805", "slutt": "0850" },
                { "fag": "Samfunnsfag", "start": "0900", "slutt": "0945" },
                { "fag": "Driftsstøtte", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling", "start": "1150", "slutt": "1235" },
                { "fag": "Driftsstøtte", "start": "1235", "slutt": "1320" },
                { "fag": "Gym", "start": "1330", "slutt": "1415" },
                { "fag": "Gym", "start": "1420", "slutt": "1505" },
            ],
            "Tuesday": [
                { "fag": "Samfunnsfag", "start": "0805", "slutt": "0850" },
                { "fag": "Norsk", "start": "0900", "slutt": "0945" },
                { "fag": "Norsk", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling", "start": "1150", "slutt": "1235" },
                { "fag": "Brukerstøtte", "start": "1235", "slutt": "1320" },
                { "fag": "Driftsstøtte", "start": "1330", "slutt": "1415" },
                { "fag": "Klassens time", "start": "1420", "slutt": "1505" }
            ],
            "Wednesday": [
                { "fag": "YFF", "start": "0805", "slutt": "0850" },
                { "fag": "YFF", "start": "0900", "slutt": "0945" },
                { "fag": "YFF", "start": "0950", "slutt": "1035" },
                { "fag": "YFF", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "YFF", "start": "1150", "slutt": "1235" },
                { "fag": "YFF", "start": "1235", "slutt": "1320" },
                { "fag": "YFF", "start": "1330", "slutt": "1415" },
                { "fag": "YFF", "start": "1420", "slutt": "1505" }
            ],
            "Thursday": [
                { "fag": "Norsk", "start": "0805", "slutt": "0850" },
                { "fag": "Norsk", "start": "0900", "slutt": "0945" },
                { "fag": "Utvikling", "start": "0950", "slutt": "1035" },
                { "fag": "Driftsstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" }
            ],
            "Friday": [
                { "fag": "Brukerstøtte-Dybdelære", "start": "0805", "slutt": "0850" },
                { "fag": "Utvikling-Dybdelære", "start": "0900", "slutt": "0945" },
                { "fag": "Driftsstøtte-Dybdelære", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte-Dybdelære", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling-Dybdelære", "start": "1150", "slutt": "1235" },
                { "fag": "Driftsstøtte-Dybdelære", "start": "1235", "slutt": "1320" },
                { "fag": "Utvikling-Dybdelære", "start": "1330", "slutt": "1415" }
            ]
        }
        const d = new Date()
        let nameOfDay;
        let dayOfWeekNumber = d.getDay();
        switch(dayOfWeekNumber) {
            case 0: 
                nameOfDay = 'Sunday';
                break;
            case 1:
                nameOfDay = 'Monday';
                break;
            case 2:
                nameOfDay = 'Tuesday';
                break;
            case 3:
                nameOfDay = 'Wednesday';
                break;
            case 4:
                nameOfDay = 'Thursday';
                break;
            case 5:
                nameOfDay = 'Friday';
                break;
            case 6:
                nameOfDay = 'Saturday';
                break;
        }
        
        let tid = d.toLocaleTimeString()
        tid = tid.slice(0, tid.length-3).replace(':', '');
        let currenttime;
        for (let i = 0; i < timer[nameOfDay].length; i++) {
            if (tid >= timer[nameOfDay][i].start && tid <= timer[nameOfDay][i].slutt) {
                currenttime = timer[nameOfDay][i].fag
            } else if (tid >= timer[nameOfDay][i].slutt && tid <= timer[nameOfDay][i+1].start) {
                currenttime = "Friminutt";
            }
        }
        
        let embed = new Discord.MessageEmbed()
            .setTitle('Timene dine idag')
            .setDescription(`Du har nå: ${cuttime}`)
        for (let i = 0; i < timer[nameOfDay].length; i++) {
            embed.addField(`${timer[nameOfDay][i].start} - ${timer[nameOfDay][i].slutt}`, `${timer[nameOfDay][i].fag}`)
        }

        let msg = await message.channel.send(embed)
    }
}