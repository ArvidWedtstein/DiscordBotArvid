const language = require('../language/language')
const profileSchema = require('../../schemas/profileschema');
const level = require('../../levels')
const Discord = require('discord.js');
const config = require('../../config.json')
const boticons = require('../reaction/boticons')
const c = require('ansi-colors');
module.exports = async (client) => {
    const checkForBirthday = async () => {
        const list = client.guilds.cache.get('524951977243836417');
                list.members.cache.each(async member => {
                    const userId = member.user.id
                    const guild = member.guild;
                    let news =  member.guild.channels.cache.find(channel => channel.name === 'nyheter');
                    if (!news) {
                        const name = `${language(guild, 'NEWS_CHANNELNAME')}`
                            member.guild.channels
                                .create(name, {
                                    type: 'text',
                                })
                                news =  member.guild.channels.cache.find(channel => channel.name === 'nyheter');
                    }
                        const results = await profileSchema.findOne({
                            userId
                        })
                        if (!results) {
                            return
                        }
                        //const guildId = results.guildId;
                        var d = new Date,
                        dformat = [
                            d.getDate(),
                            d.getMonth()+1,
                        ].join('/')+''
                        const birthday = dformat;
                        
                        if (results.birthday == '1/1') {
                            return;
                        }
                        
                        if (results.birthday == birthday) {
                            let embedCom = new Discord.MessageEmbed()
                                .setColor(config.botEmbedHex)
                                .setTitle(`${boticons(client, 'firework')}${language(guild, 'BIRTHDAY_ANNOUNCEMENT')}!${boticons(client, 'firework')}`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setDescription(`<@${results.userId}> ${language(guild, 'BIRTHDAY_USER')}\n@everyone\n${language(guild, 'PROMOTE_USER')} to <@${results.userId}>! (+5000xp) `)
                                //.addField(`<@${results.userId}> `, `${language(guild, 'BIRTHDAY_USER')}`)
                                //.addField(`@everyone`, `${language(guild, 'PROMOTE_USER')} to <@${results.userId}>! (+5000xp)`)


                            const guildId = guild.id
                            news.messages.fetch({ limit: 1 }).then(messages => {
                                let lastMessage = messages.first();
                                
                                //console.log(lastMessage.embeds[0].description)
                                
                                if (lastMessage.embeds[0]) {
                                    let last = lastMessage.embeds[0].description
                                    let str1 = last.substr(0, last.indexOf(" "))
                                    let str2 = embedCom.description.substr(0, embedCom.description.indexOf(" "))
                                    if (str1 == str2) {
                                        return
                                    } else {
                                        //console.log('BIRTHDAY')
                                        //news.send(`<@${results.userId}> has birthday today!`)
                                        let messageEmbed = news.send(embedCom).then((message) => {
                                            level.addXP(guildId, userId, 5000, message)
                                        })
                                    }
                                } else {
                                    //console.log('BIRTHDAY')
                                    //news.send(`<@${results.userId}> has birthday today!`)
                                    let messageEmbed = news.send(embedCom).then((message) => {
                                        level.addXP(guildId, userId, 5000, message)
                                    })
                                }
                                
                            })
                            
                            
                            
        
                        } else {
                            //console.log('No birthday')
                        }
                    }); 
                setTimeout(checkForBirthday, 86400 * 1000 )
        let lineupper = `╭───────────────────────────╮`;
        let vert = '│';
        let linelower2 = '├───────────────────────────┤';
        let linelower = '╰───────────────────────────╯';
        console.log(`${vert} Execute CheckForBirthday  ${vert}`)
    };
    checkForBirthday();
}

