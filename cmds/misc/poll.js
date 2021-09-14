const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const pollSchema = require('../../schemas/poll-schema');
const config = require('../../config.json')

module.exports = class PollCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            group: 'misc',
            memberName: 'poll',
            description: 'poll',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ]
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'poll')
        message.delete()
        let pollId = message.id;
        pollId = pollId.slice(12);
        const yes = '👍';
        const no = '👎';
        let empty = '---------------';
        let question = args.slice(0).join(' ');

        //If there is no question
        if (!question) {
            question = 'No question provided.';
        }
        let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle('Poll')
            .addField(question, empty)
            .setFooter(`Poll ID ${pollId}`)
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(yes);
        messageEmbed.react(no);
        const answers = {
            yes: 0,
            no: 0
        }
        await new pollSchema({
            pollId: pollId,
            messageId: message.id,
            guildId: guild.id,
            question: question,
            answers: answers,
            current: true
        }).save();
        
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            
            // If user already has reacted
            reaction.message.reactions.cache.map(x=> {
                if(x._emoji.name != reaction._emoji.name&&x.users.cache.has(user.id)) x.users.remove(user.id)
            })
            

            if (reaction.message.guild.deleted) {
                await pollSchema.deleteMany({
                    guildId: guild.id
                })
            }
            if (reaction.message.embeds[0].footer.text == `Poll ID ${pollId}`) {
                pollId = reaction.message.embeds[0].footer.text.replace('Poll ID ', '');

                answers.no = reaction.message.reactions.cache.get(no).count - 1;
                answers.yes = reaction.message.reactions.cache.get(yes).count - 1;
                await pollSchema.findOneAndUpdate({
                    pollId: pollId,
                    guildId: guild.id
                }, {
                    pollId: pollId,
                    guildId: guild.id,
                    answers: answers
                })
            }
            
        })
        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            
            if (reaction.message.guild.deleted) {
                await pollSchema.deleteMany({
                    guildId: guild.id
                })
            }
            if (reaction.message.embeds[0].footer.text == `Poll ID ${pollId}`) {
                pollId = reaction.message.embeds[0].footer.text.replace('Poll ID ', '');
                answers.no = reaction.message.reactions.cache.get(no).count - 1;
                answers.yes = reaction.message.reactions.cache.get(yes).count - 1;

                await pollSchema.findOneAndUpdate({
                    pollId: pollId,
                    guildId: guild.id
                }, {
                    pollId: pollId,
                    guildId: guild.id,
                    answers: answers
                })
            }
        });



    }
}