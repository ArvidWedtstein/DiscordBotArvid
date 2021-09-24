const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const levels = require('../../levels');
const commandStats = require('../../Stats/commandStats');
const client = require('../../main');
module.exports = class CopyRoleCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'newlevel',
            aliases: ['nl'],
            group: 'level',
            memberName: 'new level',
            description: 'new level',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            guildOnly: true,
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const rgb = [
            '#FFBF00',
            '#FFA81E',
            '#FF8F35',
            '#FF7145',
            '#FF4B4B',
            '#FF4571',
            '#FF358F',
            '#FF1EA8',
            '#FF00BF'
        ]
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'newlevel')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            message.delete()
            const text = fs.readFileSync(`./cmds/level/userlevels.json`).toString();
            let userlevels = JSON.parse(text); //now it an object
            let copyrole = args[0]
            
            if (args[0].startsWith('<@') && args[0].endsWith('>')) {
                copyrole = args[0].slice(3, -1);
                
            }
            const roletocopy = message.guild.roles.cache.find(r => r.id === copyrole)
            if (!roletocopy) {
                message.reply(`Could not find that role`)
            }
            if (!args[1]) {
                message.reply(`Please enter the new role name`); 
            }
            let level = userlevels
            Object.keys(level);
            var keys = Object.keys(level);
            let lastlevel = keys[keys.length - 1];

            let maxlevel = parseInt(lastlevel) + 10
            
            args.shift()
            const rolename = args.join(' ') +  ` (Lvl ${maxlevel})`

            console.log(roletocopy.permissions.toArray())
            const copyroleperms = roletocopy.permissions.toArray()
            message.guild.roles.create({ data: { name: rolename, color: '#ff0000', permissions: copyroleperms } });
     
            const role = await message.guild.roles.cache.find(roleval => roleval.name === rolename);
            if (!role) {
                console.log('no role found')
            }
            await role.setHoist(true);
            await role.setPosition(roletocopy.position + 0);
            let lvl = {
                [maxlevel]: `${role.id}`,
            }
            

            for (const [key, value] of Object.entries(userlevels)) {
                lvl[key] = value
            }
            
            fs.writeFile("./cmds/level/userlevels.json", JSON.stringify (lvl, null, 4), err => {
                    if (err) throw err;
                    console.log('Successfully added new level')
            })
        }       
    }
}