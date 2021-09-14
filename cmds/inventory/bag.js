const fs = require('fs');
const Discord = require('discord.js');
const iteminventory = require('./inventory')
const inventorySchema = require('../../schemas/inventory-schema')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const Canvas = require("canvas")
const { MessageAttachment } = require('discord.js')
const path = require('path')
const commandStats = require('../../Stats/commandStats')
const itemlist = require('./items')
module.exports = class BagCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'inventory',
	        aliases: ['bag', 'inv'],
            group: 'inventory',
            memberName: 'bag',
            description: 'shows your items',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        const date1 = Date.now();
        let count = {};
        const target = message.mentions.users.first() || message.author;
        const { guild } = message
        const guildId = message.guild.id
        const userId = target.id
        commandStats.cmdUse(guildId, 'inventory')

        const items = await iteminventory.getItems(guildId, userId);
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let txt;
        let itemtxt = `` 
        let itemarray = []
        if (!items) {
            //console.log('noitems')
            await new inventorySchema({
                guildId,
                userId
            }).save()
            itemtxt += 'No items'
        } else if (items == '') {
            //console.log('null')
            
            itemtxt += 'No items'
        } else {    
            for (const item of items) {
                let { name, icon } = item
                itemarray.push(name)

            }
            itemarray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
            /*const canvas = Canvas.createCanvas(500, 500)
            const ctx = canvas.getContext('2d');
            
            let x = 0;
            let y = 0;
            const background = await Canvas.loadImage(
                path.join(__dirname, '../../img/UIpanel.png')
            )
            ctx.drawImage(background, x, y)
            

            x = 45
            y = 130
            let index2 = 0;
            for (let index = 0; index < 15; index++) {
                
                if (index == 3) {
                    y = 130
                    x += 85
                } else if (index == 6) {
                    y = 130
                    x += 85
                } else if (index == 9) {
                    y = 130
                    x += 85
                } else if (index == 12) {
                    y = 130
                    x += 85
                } else if (index == 15) {
                    y = 130
                    x += 85
                }
    
                y += 85
                const invslot = await Canvas.loadImage(
                    path.join(__dirname, `../../img/InventorySlot.png`)
                )
                ctx.drawImage(invslot, x - 5, y - 5, 80, 80);
            }
            x = 55
            y = 225
            let s = 0;*/
            for (const key in count) {
                /*const icon = await Canvas.loadImage(
                    path.join(__dirname, `../../img/${itemlist[key].icon}`)
                )
                const amountimg = await Canvas.loadImage(
                    path.join(__dirname, `../../img/LevelUI.png`)
                )
                
                if (s == 5) {
                    x = 55
                    y += 85
                } else if (s == 10) {
                    x = 55
                    y += 85
                } else if (s == 15) {
                    x = 55
                    y += 85
                }
                
                ctx.drawImage(icon, x, y, 50, 50);
                ctx.drawImage(amountimg, x + 30, y + 30, 30, 30);
                
                ctx.fillStyle = '#ffffff'
                ctx.font = "18px bahnschrift"
                let text = `${count[key]}`
                ctx.fillText(text, x + 41, y + 50)*/

                txt = `${this.client.emojis.cache.find(emoji => emoji.id === itemlist[key].emoji)} ${capitalizeFirstLetter(key)} (${count[key]}x)\n`
                
                
                itemtxt += txt
                
                //x += 85
                //s++;
            }


            /*const attachment = new MessageAttachment(canvas.toBuffer(), 'test.png')
            message.channel.send(`${(Date.now() - date1) / 1000}s`, attachment)*/
            
        }

        const emptyarray = arr => arr.length = 0;
        let embed = new Discord.MessageEmbed()
        .setColor('ff4300')
        .setAuthor(`${target.username}'s ${language(guild, 'INVENTORY_TITLE')}`, `${target.displayAvatarURL()}`)
        .addField(`Item${itemarray.length === 1 ? '' : 's'}: `, itemtxt)
        
        let messageEmbed = await message.channel.send(embed);
        emptyarray(itemarray);
        itemtxt = ''
        count = {}
    }
}

