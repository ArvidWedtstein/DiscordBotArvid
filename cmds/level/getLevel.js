const levelsys = require('../../levels');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const Canvas = require('canvas')
const path = require('path')
const commandStats = require('../../Stats/commandStats')
module.exports = class LevelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'level',
            aliases: ['lvl'],
            group: 'level',
            memberName: 'level',
            description: 'get your current level',
            guildOnly: true,
            userPermissions: ['SEND_TTS_MESSAGES']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const level = await levelsys.getLevel(guild.id, message.author.id)
        commandStats.cmdUse(guild.id, 'level')
        
        /*var levelCanvas = {}
        levelCanvas.create = Canvas.createCanvas(1024, 500)
        levelCanvas.context = levelCanvas.create.getContext('2d')
        levelCanvas.context.font = '72px papyrus';
        levelCanvas.context.fillStyle = '#ffffff';
        Canvas.loadImage('./img/welcome.png').then(async (img) => {
            levelCanvas.context.drawImage(img, 0, 0, 1024, 500)
            levelCanvas.context.fillText(`${message.author}`, 360, 360)
            levelCanvas.context.beginPath();
            levelCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true)
            levelCanvas.context.stroke()
            levelCanvas.context.fill()
        })
        

        let canvas = levelCanvas;
        canvas.context.font = '42px papyrus',
        canvas.context.textAlign = 'center',
        canvas.context.fillText(level, 512, 410)
        */
       let background;
        const canvas = Canvas.createCanvas(700, 250)
        const ctx = canvas.getContext('2d');
        if (level == 200) {
            background = await Canvas.loadImage(
                path.join(__dirname, '../../img/hentai.png')
            )
        } else if (level == 160) {
            background = await Canvas.loadImage(
                path.join(__dirname, '../../RGB.jpg')
            )
        } else {
            background = await Canvas.loadImage(
                path.join(__dirname, '../../img/welcome.png')
            )
        }
        

        let x = canvas.width / 2 - background.width / 2
        let y = 0;

        ctx.drawImage(background, x, y)

        const pfp = await Canvas.loadImage(
            message.author.displayAvatarURL({
                format: 'png',
            })
        )
        x = canvas.width / 2 - pfp.width / 2
        y = 25
        //ctx.drawImage(pfp, x, y)

        ctx.fillStyle = "#ffffff"
        ctx.font = "35px papyrus"
        let text = `Your level is ${level}`
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 60 + pfp.height)

        ctx.beginPath();
        x = canvas.width / 2 - pfp.width / 2

        y = 50
        ctx.arc(x + 50, y + 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(pfp, x, y - 0, 100, 100);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `lvl-${message.author}.png`);
        message.channel.send('', attachment)

        /*const attachment = new Discord.MessageAttachment(`./img/ErlingMoney.png`, `ErlingMoney.png`);
        

        let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle('You level:')
        .setDescription(`${message.author}, your level is **${level}**`)
        .attachFiles(attachment)
        .setThumbnail(`attachment://ErlingMoney.png`);
        message.channel.send(embed)*/
    }   
}
