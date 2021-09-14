//  htmlToPng.js
const { MessageAttachment } = require('discord.js')
const nodeHtmlToImage = require('node-html-to-image')
const economy = require('../../economy')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class HTMLCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'html',
            aliases: ['htmlembed'],
            group: 'economy',
            memberName: 'html',
            description: 'custom embed',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            hidden: true
        })
    }

    async run(message, args) {
      const name = message.author.username
      const { guild, member } = message
      const coinsOwned = await economy.getCoins(guild.id, member.id)
      commandStats.cmdUse(guild.id, 'html')
      const _htmlTemplate = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <style>
            body {
              font-family: "Papyrus", Arial, Helvetica, sans-serif;
              background: rgb(22, 22, 22);
              color: #fff;
              max-width: 300px;
            }
      
            .app {
              max-width: 300px;
              padding: 20px;
              display: flex;
              flex-direction: row;
              border-top: 3px solid rgb(16, 180, 209);
              background: rgb(31, 31, 31);
              align-items: center;
            }
      
            .img {
              width: 100px;
              height: 100px;
              margin-right: 20px;
              border-radius: 5%;
              border: 0px solid #fff;
              padding: 5px;
              position: absolute;
            }
            .imglevel {
              width: 70px;
              height: 70px;
              margin-right: 80px;
              margin-top: 35px;
              border-radius: 5%;
              border: 0px solid #fff;
              padding: 0px;
              z-index: 3;
              position: absolute;
              background-image: url("ErlingMoney.png");
            }
            .leveltext {
              position: absolute;
              margin-top: 35px;
              margin-left: 25px;
              z-index: 6;
              
              text-align: center;
              vertical-align: middle;
              font-size: 30px;
            }
            .img2 {
              width: 50px;
              height: 50px;
              position: absolute;
              border-radius: 5%;
              margin-left: 180px;
              margin-top: -70px;
              padding: 0px;
              border: 0px solid #fff;
            }
            .roles {
              border-top: 3px #ff0000 solid;
              background: rgba(0,0,0,0.3);
              padding: 5px;
              width: 100%;
            }
            .titlecoins {
              margin-left: 20px;
            }
            .coins {
              margin-top: -30px;
              margin-left: 20px;
            }
          </style>
        </head>
        <body>
          <div class="app">
            <img class="img" src="${message.author.avatarURL()}" />
            <img class="imglevel" src="https://cdn.discordapp.com/attachments/788128673853210675/812302309744574464/LevelUI.png" />
            <h4 style="margin-left: 140px;">${name}</h4>
          </div>
          <div class="roles">
            <h4 class="titlecoins">Your ErlingCoins:</h4>
            
            <div class="img2" />
           
          </div>
        </body>
      </html>
      `
      
        const images = await nodeHtmlToImage({
          html: _htmlTemplate,
          quality: 100,
          type: 'jpg',
          puppeteerArgs: {
            args: ['--no-sandbox'],
          },
          encoding: 'buffer',
        })
      // for more configuration options refer to the library
        return message.channel.send(new MessageAttachment(images, `${name}.jpg`))
        
    }
}