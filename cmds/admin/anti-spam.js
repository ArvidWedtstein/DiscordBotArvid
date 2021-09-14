

const usersMap = new Map();
const LIMIT = 5
const TIME = 1000 * 30;
const DIFF = 3000;
module.exports = async (client) => {
    client.on('message', async (message) => {
        if (message.author.bot) return;
        if (usersMap.has(message.author.id)) {
            const userData = usersMap.get(message.author.id);
            const {lastMessage, timer} = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
            if (difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, TIME);
                usersMap.set(message.author.id, userData);
            } else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {
                    //const mute = message.guild.roles.cache.get('719816647455539221')
                    const mute = message.guild.roles.cache.find(role => role.name === "Muted");
                    if (!mute) {
                        //message.guild.roles.create( {name: 'Muted', color: "#818386" } )
                        message.guild.roles.create({ data: { name: 'Muted', color: '#818386', permissions: [] } });
                        
                        
                        setTimeout(async () => {
                            let mute2 = await message.guild.roles.cache.find(roleval => roleval.name === "Muted");
                            if (!mute2) {
                                return
                            }
                            message.member.roles.add(mute2);
                            const highestrole = message.guild.me.roles.highest;
                            await mute2.setPosition(highestrole.position - 1);
                            setTimeout(() => {
                                message.member.roles.remove(mute2);
                            }, TIME)
                        }, 500)
                    } else {
                        await message.member.roles.add(mute);
                        //message.author.send('You have been muted for spamming')
                        setTimeout(() => {
                            message.member.roles.remove(mute);
                        }, TIME)
                    }
                    
                    
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        } else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
                //console.log('Removed from map.');
                //message.author.send('You have been unmuted')
            }, TIME)
            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }
    })
}
