const fs = require('fs');
const { MessageAttachment } = require('discord.js')
const config = require('../../config.json')
const Canvas = require("canvas")
const language = require('../language/language')
const settings = require('../features/setting')
module.exports = async (client, Discord) => {
    var d = new Date();
    
    client.on('guildMemberAdd', async (member) => {
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
                    /*const msg = `${member}. ${language(guild, 'WELCOME_RULES')}`
                    let embed = new Discord.MessageEmbed()
                        .setColor(config.botEmbedHex)
                        .setTitle(`${language(guild, 'WELCOME')}`)
                        .setDescription(msg)
                        .setThumbnail(member.user.avatarURL())
        
                    let messageEmbed = channel2.send(embed)*/
                })
                
            } else {
                
                /*const msg = `${member}. ${language(guild, 'WELCOME_RULES')}`
                let embed = new Discord.MessageEmbed()
                    .setColor(config.botEmbedHex)
                    .setTitle(`${language(guild, 'WELCOME')}`)
                    .setDescription(msg)
                    .setThumbnail(member.user.avatarURL())
                let messageEmbed = channel.send(embed)*/

                const canvas = Canvas.createCanvas(800, 500)
                const ctx = canvas.getContext('2d');
        
                const background = await Canvas.loadImage(
                    path.join(__dirname, '../../img/wallpaper.jpg')
                )
        
                let x = 0;
                let y = 0;
        
                ctx.drawImage(background, x, y)
                
        
                const pfp = await Canvas.loadImage(member.user.displayAvatarURL({
                    format: 'png',
                }));
                const user = await Canvas.loadImage(
                    path.join(__dirname, '../../img/PlayerAvatarUI.png')
                )
                x = canvas.width / 2 - pfp.width / 2
                y = 50
                ctx.drawImage(user, x - 70, y - 20, 240, 240);
            
                ctx.fillStyle = '#ffffff'
                ctx.font = "50px papyrus"
                let text = `${language(guild, 'WELCOME')} ${member.user.tag}`
                x = canvas.width / 2 - ctx.measureText(text).width / 2
                ctx.fillText(text, x, 200 + pfp.height)
        
                ctx.font = "40px papyrus"
                text = `${language(guild, 'WELCOME_RULES')}`
                x = canvas.width / 2 - ctx.measureText(text).width / 2
                ctx.fillText(text, x, 300 + pfp.height)
        
        
                // Curved avatar image
                ctx.beginPath();
                x = canvas.width / 2 - pfp.width / 2
        
                y = 50
                ctx.arc(x + 50, y + 100, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
        
                ctx.drawImage(pfp, x - 50, y, 200, 200);
        
        
                const attachment = new MessageAttachment(canvas.toBuffer())
                channel.send('', attachment)

            
            }   
        }
    });
}