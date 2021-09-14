const moment = require('moment')
const messageCountSchema = require('../schemas/message-count-schema')
module.exports = client => {
    client.on('message', async (message) => {
        var d = new Date();
        const date = [
            d.getDate(),
            d.getMonth()+1,
            d.getFullYear()
        ].join('.')
        setTimeout(
            midnightTask,
            moment("24:00:00", "hh:mm:ss").diff(moment(), 'seconds')
        );
         
        function midnightTask() {

        }
        if (!message.guild) {
            return
        }
        const { author } = message
        const { guild } = message
        const guildId = guild.id
        const userId = author.id
        if (message.author.bot) {
            return;
        }
        const result = await messageCountSchema.findOneAndUpdate({
            userId: userId,
            guildId: guildId,
        }, {
            userId: userId,
            guildId: guildId,
            $inc: {
                'messageCount': 1
            },
        }, {
            upsert: true,
        })
        .catch((err) => {
            console.log(err)
        })
        //console.log(result)
    })
}