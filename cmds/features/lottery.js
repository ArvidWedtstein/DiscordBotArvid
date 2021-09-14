const economy = require('../../economy')
const inventory = require('../inventory/inventory')
const items = require('../inventory/items')
const language = require('../language/language')
const Discord = require('discord.js');
module.exports = (client) => {
    const lotteryWinner = async () => {
        const now = new Date()
        const guild = client.guilds.cache.get('524951977243836417');
        let user = guild.members.cache.random();
        if (user.bot) {
            return user = guild.members.cache.random();
            
        }

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        const guildId = guild.id;
        const userId = user.id;
        let array = []
        let icons = []
        for (const [key, value] of Object.entries(items)) {
            array.push(value.name)
            icons.push(value.icon)
        }
        let randomitem = Math.floor(array.length * Math.random());
        let itemamount = getRandomIntInclusive(1, 5)
        await inventory.addItem(guildId, userId, array[randomitem], itemamount);

        let color = await economy.getColor(guildId, userId);

        const attachment = new Discord.MessageAttachment(`./img/${icons[randomitem]}`, `${icons[randomitem]}`)
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Lottery')
        .setDescription(`${language(guild, 'LOTTERY_WIN')} ${itemamount} ${array[randomitem]}`)
        .attachFiles(attachment)
        .setThumbnail(`attachment://${icons[randomitem]}`)
        
        let messageEmbed = await user.send(embed);
        //console.log(`${user} won ${itemamount} ${array[randomitem]}`)
        setTimeout(lotteryWinner, 1000 * 10800) //86400
    }
    setTimeout(lotteryWinner, 1000 * 10800)
}