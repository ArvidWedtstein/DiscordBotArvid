const fs = require('fs');
const Discord = require('discord.js');
module.exports = {
    commands: 'rolergb',
    expectedArgs: '',
    permissionError: '',
    minArgs: 0,
    maxArgs: null,
    callback: async (client, message, args, text) => {
        message.channel.bulkDelete(1);
        const rgbRole = message.guild.roles.cache.find(role => role.name === "rgbiskop");
        var colors = ['#ff0000','#00ff00','#0000ff'];
        for(let i = 0; i<= colors.length;i++){
            setInterval(() => {
            rgbRole.edit({
                color: colors[i]
            })
            }, 5000);
        }
    
    },
    permissions: [],
    requiredRoles: [],
}

