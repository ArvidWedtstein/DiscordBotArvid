module.exports = async (client) =>{
    const guild = client.guilds.cache.get('524951977243836417');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('805054453702983690');
        channel.setName(`Members: ${memberCount.toLocaleString()}`);
    }, 10000000);
}