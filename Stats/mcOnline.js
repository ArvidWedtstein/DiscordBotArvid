const util = require('minecraft-server-util');
module.exports = async (client) =>{
    const guild = client.guilds.cache.get('524951977243836417');
    const SERVER_ADDRESS = 'vestlandetmc.no'; // Put your minecraft server IP or hostname here (e.g. '192.168.0.1')
    const SERVER_PORT = 25565; // Put your minecraft server port here (25565 is the default)
    const STATUS_ONLINE = '';
    const STATUS_PLAYERS = '{online}'; // {online} will show player count
    const STATUS_EMPTY = '0';
    const IP_RESPONSE = '`{address}`'; // {address} and {port} will show server ip and port from above
    const cacheTime = 15 * 1000; // 15 sec cache time
    let data, lastUpdated = 0;
    const channel = guild.channels.cache.get('809708616377434173');
    
    const channel2 = guild.channels.cache.get('809721333821997056');
    setInterval(() =>{
        statusCommand();
        ipCommand();
    }, 10000);

    function statusCommand() { // Handle status command
        getStatus().then(data => {
            let status = STATUS_ONLINE;
            status += data.onlinePlayers? 
                STATUS_PLAYERS.replace('{online}', data.onlinePlayers) : STATUS_EMPTY;
                channel.setName(`Players Online: ${status}`);
        }).catch(err => {
            console.error(err);
        })
    }

    function getStatus() {
        // Return cached data if not old
        if (Date.now() < lastUpdated + cacheTime) return Promise.resolve(data);
        return util.status(SERVER_ADDRESS, { port: SERVER_PORT })
            .then(res => {
                data = res;
                lastUpdated = Date.now();
                return data;
            })
    }

    function ipCommand() { // Handle IP command
        const response = IP_RESPONSE
            .replace('{address}', SERVER_ADDRESS).replace('{port}', SERVER_PORT)
            channel2.setName(`IP: ${SERVER_ADDRESS}`);
    }
    
}