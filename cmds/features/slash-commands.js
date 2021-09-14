const Discord = require('discord.js');
const guildId = '524951977243836417'
module.exports = async (client) => {
    const getApp = (guildId) => {
        const app = client.api.applications(client.user.id);
        if (guildId) {
            app.guilds(guildId);
        }
        return app
    }

    client.on('ready', async () => {
        

        await getApp(guildId).commands.post({
            data: {
                name: 'slap',
                description: 'slap a user',
                options: [
                    {
                        name: 'Name',
                        description: 'Targets name',
                        required: true,
                        type: 3 // String
                    }
                ]
            }
        })

        
        /*const commands = await getApp(guildId).commands.get()
        
        console.log(commands)*/
        client.ws.on('INTERACTION_CREATE', async (interaction) => {
            console.log('interaction')
            const { name, options } = interaction.data;
            const command = name.toLowerCase()

            const args = {}

            if (options) {
                for (const option of options) {
                    const { name, value } = option
                    args[name] = value
                }
            }
            if (command === 'slap') {
                console.log('slap')
                let embedslap = new Discord.MessageEmbed()
                    .setColor('ff0000')
                    .setThumbnail(message.author.displayAvatarURL())
                    
                    .setImage("https://media1.tenor.com/images/e7240cfd3b00d219056296e21e3b8633/tenor.gif")
                
                for (const arg in args) {
                    const value = args[arg]
                    embedslap.setTitle(arg)
                }
                reply(interaction, 'slapp')
            }
        })
    })

    const reply = async (interaction, response) => {
        let data = {
            content: response,
        }
        if (typeof response === 'object') {
            data = await createAPIMessage(interaction, response)
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data,
            }
        })
    }

    const createAPIMessage = async (interaction, content) => {
        const { data, files } = await Discord.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        )
            .resolveData()
            .resolveFiles()
        return { ...data, files }
    }
}