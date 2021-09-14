const config = require('../../config.json')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const { MessageMenuOption, MessageMenu, MessageActionRow, MessageButton } = require('discord-buttons');
const Commando = require('discord.js-commando');
const math = require('mathjs')
const commandStats = require('../../Stats/commandStats')
module.exports = class CalculatorCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'calculator',
            aliases: ['calc'],
            group: 'features',
            memberName: 'calculator',
            description: 'solves meth',
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'calculator')
        let button = new Array([], [], [], [], [])
        let row = []
        let text = ["clear", "(", ")", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0", "00", "="]
        let current = 0;

        for (let i = 0; i < text.length; i++) {
            if (button[current].length === 4) current++
            button[current].push(createButton(text[i]))
            if (i === text.length - 1) {
                for (let btn of button) row.push(addRow(btn));
            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor("#0000ff")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription("```0```")

        
        message.channel.send({
            embed: embed,
            components: row
        }).then((msg) => {
            let isWrong = false;
            let time = 60000;
            let value = ""
            let embed1 = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("0000FF")
            function createCollector(val, result = false) {
                let filter = (buttons1) => buttons1.clicker.user.id === message.author.id && buttons1.id === "cal" + val;
                let collect = msg.createButtonCollector(filter, { time: time });

                collect.on("collect", async x => {
                    //x.defer();

                    if (result === "new") value = "0"
                    else if (isWrong) {
                        value = val
                        isWrong = false;
                    } 
                    else if (result === "0") value = val;
                    else if (result) {
                        isWrong = true;
                        value = mathEval(value)
                    }
                    else value += val

                    embed1.setDescription("```" + value + "```")
                    msg.edit({
                        embed: embed1,
                        components: row
                    })
                })
            }
            for (let txt of text) {
                let result;
                if (txt === "clear") result = "new";
                else if (txt === "=") result = true;
                else result = false
                createCollector(txt, result)
            }

            setTimeout(() => {
                embed1.setDescription("Your calculator time is running out")
                embed1.setColor("ff0000")
                msg.edit({
                    embed: embed1
                })
            }, time)
        })
        function addRow(btns) {
            let row1 = new MessageActionRow()
            for (let btn of btns) {
                row1.addComponent(btn)
            }
            return row1
        }
        function createButton(label, style = "grey") {
            if (label === "clear") style = "red"
            else if (label === ".") style = "grey"
            else if (label === "=") style = "green"
            else if (isNaN(label)) style = "blurple"

            const btn = new MessageButton()
                .setLabel(label)
                .setStyle(style)
                .setID("cal" + label)
            return btn
        }

        function mathEval(input) {
            try {
                let res = math.evaluate(input)
                return res
            } catch {
                return "Wrong input"
            }
        }
        /*function calculator(num1, type, num2) {
            if (type=='+') {
                return +num1 + +num2
            }
            if (type=='-') {
                console.log(num1 - num2)
                return num1 - num2
            }
            if (type=='*') {
                console.log(num1 * num2)
                return num1 * num2
            }
            if (type=='/') {
                console.log(num1 / num2)
                return num1 / num2
            }

        }
        if (!args[0]) return message.reply(`${language(guild, 'CALCULATOR_ARG0')}.`)
        if (!args[1]) return message.reply(`${language(guild, 'CALCULATOR_ARG1')}. (+, -, *, /)`)
        if (!args[2]) return message.reply(`${language(guild, 'CALCULATOR_ARG2')}.`)

        const embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle(`${language(guild, 'CALCULATOR_TITLE')}`)
            .addField('Input', `\`\`\`${args[0] + args[1] + args[2]}\`\`\``)
            .addField('= ', `\`\`\`${calculator(args[0],args[1],args[2])}\`\`\``)
        message.channel.send(embed)*/
        
    }
}