const request = require(`request`);
const economy = require('../../economy')
const fs = require('fs');
const c = require('ansi-colors')
const mongo = require('../../mongo')
const memeCountSchema = require('../../schemas/meme-count-schema')
const level = require('../../levels')
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando');
const { lang } = require('moment');
const commandStats = require('../../Stats/commandStats')
module.exports = class AddMemeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addmeme',
            aliases: ['+meme'],
            group: 'misc',
            memberName: 'addmeme',
            description: 'add a meme to the database',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        let image = message.attachments.first().url;
        const { guild, member } = message
        commandStats.cmdUse(guild.id, 'addmeme')
        if (!image) {
            message.reply(`${language(guild, 'ATTACH_IMAGE')}`)
            return
        }
        //console.log(image)
        message.delete()
        const { id } = 'memes'

                
        const memeFiles = fs.readdirSync('./memes').filter(file => file.endsWith('.png'));
        const memeCountcache = memeFiles.length + 2
        const memeCount = memeCountcache + 1
        const xpEarn = 50;
        
        
        const result = await memeCountSchema.findOneAndUpdate({
            id
        }, {
            id,
            memeCount
        }, {
            upsert: true,
            new: true,
        }).catch((err) => {
            console.log(err)
        })
        if (!result) {
            new memeCountSchema({
                id,
                memeCount
            })
        }
        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
            })
        }
        //console.log(result.memeCount)

        console.log(memeCount)
        const guildId = guild.id;
        const userId = member.id
        
        const url = image;
        const path = `./memes/` + memeCount + `.png`;
        download(url, path, async () => {
            //console.log('✅ Added meme')
            //message.channel.bulkDelete(1);
            //economy.addCoins(guild.id, member.id, coinEarn)
            level.addXP(guildId, userId, xpEarn, message)
            message.reply(`${language(guild, 'MEME_SUBMISSION')}.\n*You gained 30 XP*`)
            //message.reply(`Thank you for your meme submission.`)
        })
    }   
}
