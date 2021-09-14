const profileSchema = require('../../schemas/profileschema')
function suffixes(number) {
    const converted = number.toString();

    const lastChar = converted.charAt(converted.length - 1);

    return lastChar == "1" 
    ? `${converted}st` 
    : lastChar == "2" 
    ? `${converted}nd` 
    : lastChar == '3'
    ? `${converted}rd` 
    : `${converted}th`;
}
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const config = require('../../config.json')
module.exports = class AddBirthdayCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addbirthday',
            aliases: ['setbirthday', 'birthday'],
            group: 'features',
            memberName: 'addbirthday',
            description: 'add a birthday',
            argsType: 'multiple',
            userPermissions: ['SEND_MESSAGES']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'addbirthday')
        var d = new Date,
            dformat = [
                d.getDate(),
                d.getMonth()+1,
            ].join('/')+' '


        const months = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        }
        console.log(dformat)
        const user = message.guild.member(message.mentions.users.first() || message.author)
        if (message.mentions.users.first()) {
            args.shift();
        }
        const joined = args.join(" ");
        const split = joined.trim().split("/");
        let [ day, month ] = split;

        
        if (!day) return message.reply(`${language(guild, 'BIRTHDAY_DAY')}`);
        if (!month) return message.reply(`${language(guild, 'BIRTHDAY_MONTH')}`);

        if (isNaN(day) || isNaN(month)) {
            return message.reply(`${language(guild, 'BIRTHDAY_NaN')}`)
        }

        day = parseInt(day);
        month = parseInt(month);
        console.log(day, month)
        if (!day || day > 31) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);
        if (!month || month > 12) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);

        /*const convertedDay = suffixes(day);
        const convertedMonth = months[month];
        message.channel.send(`${convertedDay} of ${convertedMonth}`)
        */

        const birthday = `${day}/${month}`;
        //console.log(birthday)
        
        const userId = user.id;
        const profileresult = await profileSchema.findOne({ guildId, userId })
                
        if (!profileresult) {
            let embed = new Discord.MessageEmbed()
                .setColor(config.botEmbedHex)
                .setAuthor(`${user.user.username}'s ${language(guild, 'BIRTHDAY_CHANGE')} **${birthday}**`, user.user.avatarURL())
            message.reply({
                embeds: [embed]
            })
            new profileSchema({
                guildId,
                userId,
                $set: {
                    birthday
                }
            })
        } else {
            let embed = new Discord.MessageEmbed()
                .setColor(config.botEmbedHex)
                .setAuthor(`${user.user.username}'s ${language(guild, 'BIRTHDAY_CHANGE')} ${birthday}`, user.user.displayAvatarURL({ dynamic: true}))
            message.reply({
                embeds: [embed]
            })
            //message.reply(`${user}'s ${language(guild, 'BIRTHDAY_CHANGE')} **${birthday}**`)

            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $set: {
                    birthday
                }
            }, {
                upsert: true,
            })
        }
    }
}
