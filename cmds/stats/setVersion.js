const Discord = require('discord.js');
const config = require('../../config.json')
const fs = require('fs');
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class SetVersionCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setversion',
            group: 'stats',
            memberName: 'setversion',
            description: 'sets bot version',
            argsType: 'multiple',
            userPermissions: [
                'BAN_MEMBERS'
            ]
        })
    }

    async run(message, args) {
        message.delete();
        let version = {
            version: `${args[0]}`
        }

        let obj = []
        const text = fs.readFileSync(`./config.json`).toString();

        obj = JSON.parse(text); //now it an object

        for (const [key, value] of Object.entries(obj)) {
            version[key] = value

            
        }
        console.log(version)
        fs.writeFile("./config.json", JSON.stringify(version, null, 4), err => {
                if (err) throw err;
                console.log('Successfully updated version')
        })
        const text2 = fs.readFileSync(`./config.json`).toString();
        console.log(text2)
    }
}


