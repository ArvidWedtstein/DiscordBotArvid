const settingsSchema = require('../../schemas/settings-schema');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class EmoteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'emote',
            aliases: ['e'],
            group: 'misc',
            memberName: 'emote',
            description: 'emotes',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        async function updateEmbed(title, author, image, thumbnail) {
            let embed = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(thumbnail)
            .setAuthor(author)
            .setImage(image)
            .setTitle(title)
            let messageEmbed = await message.channel.send(embed);
        }
        const { guild } = message
        const guildId = guild.id
                const result = await settingsSchema.findOne({
                    guildId,
                })
                if (result) {
                    let settingEmote = result.emotes
                    if (settingEmote === false) {
                        message.channel.send(`Emotes are set to ${settingEmote} in this server`)
                    } else {
                        message.delete()
                        if(args[0] === 'gulag') {
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                if (member.id === '787324889634963486') {
                                    message.channel.send('Ha! Try again bitch.')
                                    setTimeout(()=>{
                                            /*const authortext = "`${message.author.username} was sent to gulag by ${member.username}`, `${member.displayAvatarURL()}`, 'https://www.youtube.com/watch?v=DLzxrzFCyOs'"
                                            const image = "https://media.tenor.com/images/2ebdbc0be9077e4636339539c1984f58/tenor.gif"
                                            const test = updateEmbed('', authortext, image, '')*/
                                            let embed4 = new Discord.MessageEmbed()
                                            .setColor('ff0000')
                                            .setAuthor()
                                            .setImage("https://media.tenor.com/images/2ebdbc0be9077e4636339539c1984f58/tenor.gif")
                                            let messageEmbed = message.channel.send(embed4)
                                    }, 1000);
                                } else {
                                    const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('ff0000')
                                    .setImage("https://media.tenor.com/images/2ebdbc0be9077e4636339539c1984f58/tenor.gif")
                                    .setThumbnail(member.displayAvatarURL())
                                    .setTitle(`${member.username} was sent to gulag by glorious leader Stalin`)
                                let messageEmbed = await message.channel.send(embed);
                                }
                            } else {
                                message.channel.send(`Failed to send <@${memberTarger.user.id}> to gulag`);
                            }
                        } else if (args[0] === 'slap') {
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embedslap = new Discord.MessageEmbed()
                                    .setColor('ff0000')
                                    //.setImage(member.displayAvatarURL())
                                    .setThumbnail(message.author.displayAvatarURL())
                                    .setTitle(`${message.author.username} slapped ${member.username} 👋`)
                                    .setImage("https://media1.tenor.com/images/e7240cfd3b00d219056296e21e3b8633/tenor.gif")
                        let messageEmbed = await message.channel.send(embedslap);
                            } else {
                                message.channel.send(`Failed to slap <@${memberTarger.user.id}>`);
                            }
                        } else if (args[0] === 'gas') {
                            message.channel.bulkDelete(1);
                        const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('ff0000')
                                    .setThumbnail(member.displayAvatarURL())
                                    .setImage("https://i.kym-cdn.com/photos/images/original/000/914/990/674.gif")
                                    .setTitle(`${member.username} was gassed by ${message.author.username}`)
                        let messageEmbed = await message.channel.send(embed);
                            } else {
                                message.channel.send(`Failed to gas <@${memberTarger.user.id}>`);
                            }
                        } else if (args[0] === 'kill') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('ff0000')
                                    .setThumbnail(member.displayAvatarURL())
                                    .setImage("https://media1.tenor.com/images/f5cb8b1591addd00f96b8b49924b9513/tenor.gif")
                                    .setTitle(`${message.author.username} killed ${member.username}`)
                        let messageEmbed = await message.channel.send(embed);
                            } else {
                                message.channel.send(`Failed to kill <@${memberTarger.user.id}>`);
                            }
                        } else if (args[0] === 'hug') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first(); 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                message.reply(` ga <@${memberTarger.user.id}> en klem`);
                            } else {
                                message.channel.send(`Failed to hug <@${memberTarger.user.id}>`);
                            }
                        } else if (args[0] === 'die') {
                            message.channel.bulkDelete(1);
                            const member = message.author;
                                let embed = new Discord.MessageEmbed()
                                    .setColor('000000')
                                    .setImage(member.displayAvatarURL())
                                    .setTitle(`${member.username} died.`)
                        let messageEmbed = await message.channel.send(embed);
                        } else if (args[0] === 'communism') {
                            message.channel.bulkDelete(1);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('ff0000')
                                    .setImage("https://en.meming.world/images/en/thumb/a/a9/Communist_Bugs_Bunny.jpg/300px-Communist_Bugs_Bunny.jpg")
                                    .setTitle('Communism ***Intensifies***')
                        let messageEmbed = await message.channel.send(embed);
                        } else if (args[0] === 'goose') {
                            message.channel.bulkDelete(1);
                            let embed = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle('Honk Honk')
                            .setImage("https://d2skuhm0vrry40.cloudfront.net/2020/articles/2020-08-18-10-05/-1597741532920.jpg/EG11/resize/1200x-1/-1597741532920.jpg")
                            .addFields(
                                {
                                    name: 'Honk Honk',
                                    value: 'Watch out for goose with knife',
                                    inline: true,
                                }
                            );
                        let messageEmbed = await message.channel.send(embed);
                        } else if (args[0] === 'plague') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`${message.author.username} infected ${member.username}`)
                            .setImage("https://media.tenor.com/images/1300a93ca70ca93068b9516b3d270b6f/tenor.gif")
                        let messageEmbed = await message.channel.send(embed);
                            }
                        } else if (args[0] === 'nazi') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`${message.author.username} inspects ${member.username}`)
                            let messageEmbed = await message.channel.send(embed);
                            setTimeout(()=>{
                                let embed2 = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`Got you now, ${member.username}` + '!')
                            .setImage("https://media.discordapp.net/attachments/713127505325981857/801528289042759690/20101007-KDS-Holocaust20boy.png")
                            let messageEmbed = message.channel.send(embed2);
                            }, 2000);
                            }
                        } else if (args[0] === 'awake') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`Hey you, ${member.username}`)
                            let messageEmbed = await message.channel.send(embed);
                            setTimeout(()=>{
                                let embed2 = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`You're finally awake.`)
                            .setImage("https://pa1.narvii.com/7595/06b5f7c86ae0bb6b47f75d908536e02e7717ff1dr1-444-250_hq.gif")
                            let messageEmbed = message.channel.send(embed2);
                            }, 1000);
                            }
                        } else if (args[0] === 'seppuku') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`${message.author.username}: Hey, ${member.username} wanna commit seppuku?`)
                            let messageEmbed = await message.channel.send(embed);
                            setTimeout(()=>{
                                let embed2 = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`${member.username} commits seppuku`)
                            .setImage("https://pbs.twimg.com/media/DkvkEL7UUAA4DTf.jpg")
                            let messageEmbed = message.channel.send(embed2);
                            setTimeout(()=>{
                                message.channel.bulkDelete(1);
                                let embed3 = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`...`)
                            .setImage("https://media1.tenor.com/images/58f72d6a4dc64bcca0755849a3ef95c0/tenor.gif")
                            let messageEmbed = message.channel.send(embed3);
                            }, 5000);
                            }, 3000);
                            }
                        } else if (args[0] === 'rickroll') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('000000')
                            .setTitle(`You just got rickrolled ${member.username}`)
                            .setImage('https://i.imgur.com/WsUV4DK.gif')
                            let messageEmbed = await message.channel.send(embed);
                            }
                        } else if (args[0] === 'lick') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('ff00ff')
                            .setTitle(`${message.author.username} licked you, ${member.username}`)
                            .setImage('https://www.google.com/url?sa=i&url=https%3A%2F%2Ftenor.com%2Fview%2Fpog-tasty-pog-tasty-licking-looks-yummy-gif-16895495&psig=AOvVaw2szMRop-QlMHKMvSr26aLq&ust=1614858761607000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPikneyHlO8CFQAAAAAdAAAAABBZ')
                            let messageEmbed = await message.channel.send(embed);
                            }
                        } else if (args[0] === 'techtips') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('FF4C02')
                                    .setTitle(`Linus wants your tech tips, ${member.username}`)
                                    .setImage('https://i.kym-cdn.com/photos/images/original/001/583/327/ba9.jpg')
                                let messageEmbed = await message.channel.send(embed);
                            }
                        } else if (args[0] === 'laugh') {
                            message.channel.bulkDelete(1);
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                            .setColor('FF0002')
                            .setTitle(`laughs at you, ${member.username}`)
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setThumbnail('https://discordemoji.com/assets/emoji/6083_ExsDee.gif')
                            .setImage(member.displayAvatarURL())
                            let messageEmbed = await message.channel.send(embed);
                            }
                        } else if (args[0] === 'pan') {
                            message.delete();
                            const member = message.mentions.users.first() || message.author; 
                            if(member){
                                const memberTarger = message.guild.members.cache.get(member.id);
                                let embed = new Discord.MessageEmbed()
                                    .setColor('FF0002')
                                    .setTitle(`used pan at, ${member.username}`)
                                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                                    .setImage('https://media1.tenor.com/images/a9f22017e523f162a62c802bda40ed72/tenor.gif')
                                    .setThumbnail(member.displayAvatarURL())
                                let messageEmbed = await message.channel.send(embed);
                            }
                        }
                    }
                } else {
                    await new settingsSchema({
                        guildId,
                        emotes: true
                    }).save()
                    return
                }

    }
}