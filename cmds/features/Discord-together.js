const { DiscordTogether } = require('discord-together');
const client = require('../../main');

const discordTogether = new DiscordTogether(client);

module.exports = discordTogether;