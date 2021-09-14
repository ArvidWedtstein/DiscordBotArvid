const mongo = require('../../mongo')
const mongoose = require('mongoose')
const quizSchema = require('../../schemas/quiz-schema');
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class QuizCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            aliases: ['quizlet'],
            group: 'misc',
            memberName: 'quiz',
            description: 'quiz',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()
                console.log('Question Added')
                const userquestion = args.join(' ')

                //const json = JSON.parse(args.join(' '))
                const json = JSON.stringify(args.join(' '))

                const { text = '' } = json
                const answers = json
                console.log(json)
                const guildId = message.guild.id
                commandStats.cmdUse(guildId, 'quiz')
                const question = {
                    userquestion,
                    answers
                }
                await quizSchema.findOneAndUpdate({
                    guildId,
                }, {
                    guildId,
                    $push: {
                        questions: question
                    }
                }, {
                    upsert: true
                })
    }
}