//const Canvas = require("canvas")
const { MessageAttachment } = require('discord.js')
const path = require('path')
const { getChannelId } = require('./setwelcome')
const language = require('../language/language')
const settings = require('../features/setting')
module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {
        const date1 = Date.now();
        
        const { guild } = member
        const setting = await settings.settingsguild(guild.id, 'welcome');
        if (setting == false) {
            // message.reply(`${language(guild, 'SETTING_OFF')} Welcome/Leave ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const channelId = getChannelId(guild.id)
            //const channelId = '715529449357180960'
            if (!channelId) {
                return
            }
            
            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                return
            }
            channel.send(`${language(guild, 'LEAVE')} ${member.user.tag}`)
            //const canvas = Canvas.createCanvas(800, 500)
            /*const canvas = Canvas.createCanvas(400, 500)
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage(
                //path.join(__dirname, '../../img/wallpaper.jpg')
                path.join(__dirname, '../../img/background.png')
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
            ctx.drawImage(user, x + 10, y + 80, 120, 120);
            
            
        
        
            ctx.fillStyle = '#ffffff'
            ctx.font = "30px immortal"
            let text = `${language(guild, 'LEAVE')}`
            x = canvas.width / 2 - ctx.measureText(text).width / 2
            ctx.fillText(text, x, 150 + pfp.height)

            ctx.fillStyle = '#ffffff'
            ctx.font = "30px immortal"
            let text2 = `${member.user.tag}`
            x = canvas.width / 2 - ctx.measureText(text2).width / 2
            

            const title = await Canvas.loadImage(
                path.join(__dirname, '../../img/title.png')
            )

            ctx.drawImage(title, x - 50, 300, ctx.measureText(text2).width + 100, 80);
            ctx.fillText(text2, x, 220 + pfp.height)



            // Curved avatar image
            ctx.beginPath();
            x = canvas.width / 2 - pfp.width / 2

            y = 50
            ctx.arc(x + 70, y + 140, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(pfp, x + 20, y + 90, 100, 100);
            const timeusedtosend = `${(Date.now() - date1) / 1000}s`
            const attachment = new MessageAttachment(canvas.toBuffer())
            channel.send(`** **`, attachment)*/
        }
    })
}