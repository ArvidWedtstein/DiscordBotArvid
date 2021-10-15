const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class PythonCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'python',
            aliases: ['paitån'],
            group: 'features',
            memberName: 'python',
            description: 'gives help about python basics',
            argsType: 'multiple',
        })
    }

    async run(message, args) {
        const operatoremoji = '‼️';
        const variableemoji = '🔢';
        const operators = ['➕', '➖', '➗', '✖️']
        let embedCom = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle('Python')
            .setDescription(`-- React/choose a category --`)
            .addFields(
                {name: '‼️', value: 'Operators', inline: false},
                {name: '‼', value: 'Variable', inline: false},
            )

        message.delete()

        const { guild } = message
        const guildId = guild.id

        commandStats.cmdUse(guildId, 'python')
        let messageEmbed = await message.channel.send(embedCom);
            messageEmbed.react(operatoremoji);
            messageEmbed.react(variableemoji);

            this.client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
    
                if (reaction.message.channel.id == message.channel.id) {
                    if (reaction.emoji.name === operatoremoji) {
                        message.channel.bulkDelete(1)
                        let embedCom = new Discord.MessageEmbed()
                        .setColor('ff4300')
                        .setTitle('Python Operators')
                        .setDescription('Choose a operator')
                        .addFields(
                            {name: '+', value: 'Addition', inline: false},
                            {name: '-', value: 'Subtract', inline: false},
                            {name: 'x', value: 'Divide', inline: false},
                            {name: '/', value: 'Multiply', inline: false}
                        )
                        //await reaction.message.guild.members.cache.get(user.id).send(embedCom)
                        let messageEmbed2 = await message.channel.send(embedCom);
                        for (let i = 0; i < operators.length; i++) {
                            messageEmbed2.react(operators[i]);
                        }
                    }
                    if (reaction.emoji.name === variableemoji) {
                        let embedCom = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle(variableemoji)
                            .addField('Variables', "Variables in python do not need to be declared with any particular type.\nExample\nx = 5 | x is of type int\ny = 'test' | y is of type str\n [More info](https://w3schools.com/python/python_variables.asp)")
                        let messageEmbed3 = await message.channel.send(embedCom);
                            
                    }
                    if (reaction.emoji.name === operators[0]) {
                        let embedCom = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle(operators[0])
                            .setDescription('The addition operator can be used to add numbers.\nExample:\nx = 3\ny = 5\nz = x + y')
                        let messageEmbed3 = await message.channel.send(embedCom);
                    }
                    if (reaction.emoji.name === operators[1]) {
                        let embedCom = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle(operators[1])
                            .setDescription('The subdivision operator can be used to subdivide numbers.\nExample:\nx = 5\ny = 3\nz = x - y\nz = 2')
                        let messageEmbed3 = await message.channel.send(embedCom);
                    }
                    if (reaction.emoji.name === operators[2]) {
                        let embedCom = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle(operators[2])
                            .setDescription('The division operator can be used to divide numbers.\nExample:\nx = 15\ny = 3\nz = x / y\nz = 5')
                        let messageEmbed3 = await message.channel.send(embedCom);
                    }
                    if (reaction.emoji.name === operators[3]) {
                        let embedCom = new Discord.MessageEmbed()
                            .setColor('ff4300')
                            .setTitle(operators[3])
                            .setDescription('The multiply operator can be used to multiply numbers.\nExample:\nx = 5\ny = 3\nz = x * y\nz = 15')
                        let messageEmbed3 = await message.channel.send(embedCom);
                    }
                } else {
                    return;
                }
            });
    
    
            this.client.on('messageReactionRemove', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
    
                if (reaction.message.channel.id == channel) {
                    if (reaction.emoji.name === rgbemoji) {
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(rgbismrole);
    
                    }
                    if (reaction.emoji.name === nonrgbemoji) {
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(nonrgbrole);
                    }
                } else {
                    return;
                }
            });
    }
}