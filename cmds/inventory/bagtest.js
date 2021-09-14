const { MessageAttachment } = require('discord.js')
const nodeHtmlToImage = require('node-html-to-image')
const economy = require('../../economy')
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class BagTestCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'bagtest',
            aliases: ['inventorytest'],
            group: 'inventory',
            memberName: 'inventorytest',
            description: 'custom embed',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            hidden: true
        })
    }

    async run(message, args) {
      const name = message.author.username
      const { guild, member } = message
      

      
        const _htmlTemplate = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <style>
            body {
              font-family: "Poppins", Arial, Helvetica, sans-serif;
              background: rgb(22, 22, 22);
              color: #fff;
              max-width: 300px;
            }
      
            .app {
              max-width: 300px;
              height: 100px;
              padding: 20px;
              display: flex;
              flex-direction: row;
              border-top: 3px solid rgb(16, 180, 209);
              background: rgb(31, 31, 31);
              align-items: center;
            }
            .inventoryslot1 {
              width: 50px;
              height: 50px;
              padding: 0px;
            }
            .inventoryslot2 {
              width: 50px;
              height: 50px;
              padding: 0px;
            }
            .inventoryslot3 {
              width: 50px;
              height: 50px;
              padding: 0px;
            }
            .inventoryslot4 {
              width: 50px;
              height: 50px;
              padding: 0px;
            }
      
            
          </style>
        </head>
        <body>
          <div class="app">
              <img class="inventoryslot1" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot2" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot3" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot4" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot5" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot6" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot7" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
              <img class="inventoryslot8" src="https://cdn.discordapp.com/attachments/808643123445760000/846647585183629312/InventorySlot.png" alt="test" />
          </div>
        </body>
      </html>
      `
      
        const images = await nodeHtmlToImage({
          html: _htmlTemplate,
          quality: 100,
          type: 'jpeg',
          puppeteerArgs: {
            args: ['--no-sandbox'],
          },
          encoding: 'buffer',
        })

     
        return message.channel
          .send(new MessageAttachment(images, `${name}.jpeg`))
      }
}
