const fs = require('fs');
const { MessageAttachment } = require('discord.js')
const Discord = require('discord.js');
const config = require('../../config.json')
//const Canvas = require("canvas")
const path = require('path')
const language = require('../language/language')
module.exports = async (client) => {
    
    client.on('guildCreate', async (guild) => { 
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        

        channel.send(`Thanks for adding me to your server!`)
        
        /*const canvas = Canvas.createCanvas(400, 500)
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            //path.join(__dirname, '../../img/wallpaper.jpg')
            path.join(__dirname, '../../img/background.png')
        )

        let x = 0;
        let y = 0;

        ctx.drawImage(background, x, y)
        

        const pfp = await Canvas.loadImage(client.user.displayAvatarURL({
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
        let text = `Thanks for adding`
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 150 + pfp.height)

        ctx.fillStyle = '#ffffff'
        ctx.font = "30px immortal"
        let text2 = `me to your server!`
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
        const attachment = new MessageAttachment(canvas.toBuffer())
        channel.send(`** **`, attachment)*/
    });
    
}
