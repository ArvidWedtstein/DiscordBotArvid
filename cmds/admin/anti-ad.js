module.exports = (client) => {
    const isInvite = async (guild, code) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if (code === invite[0]) {
                        resolve(true);
                        return
                    }
                }
                resolve(false);
            })
        })
    }
    const usersMap = new Map();
    const LIMIT = 2
    const TIME = 1000 * 30;
    const DIFF = 10000;
    client.on('message', async (message) => {
        const { guild, member, content, channel } = message
        if (!channel) return
        if (!member) return
        if (message.author.bot) return
        if (member.bot) return
        const code = content.split('discord.gg/')[1]
        //console.log('CODE:', code)

        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(guild, code)
            if (!isOurInvite) {
                if (usersMap.has(message.author.id)) {
                    const userData = usersMap.get(message.author.id);
                    const {lastMessage, timer} = userData;
                    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                    let adcount = userData.adcount;
                    if (difference > DIFF) {
                        clearTimeout(timer);
                        userData.adcount = 1;
                        userData.lastMessage = message;
                        userData.timer = setTimeout(() => {
                            usersMap.delete(message.author.id);
                        }, TIME);
                        usersMap.set(message.author.id, userData);
                    } else {
                        ++adcount;
                        console.log(adcount)
                        if (parseInt(adcount) === LIMIT) {
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

                                    
                        
                                    const highestrole = message.guild.me.roles.highest;
                                    await mute2.setPosition(highestrole.position - 1);
                                    message.member.roles.add(mute2);
                                    //message.author.send('You have been muted for spamming')
                                    setTimeout(() => {
                                        message.member.roles.remove(mute2);
                                    }, TIME)
                                    

                                }, 500)
                            } else {
                                message.member.roles.add(mute);
                                //message.author.send('You have been muted for spamming')
                                setTimeout(() => {
                                    message.member.roles.remove(mute);
                                }, TIME)
                            }
                            
                        } else {
                            userData.adcount = adcount;
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
                        adcount: 1,
                        lastMessage: message,
                        timer: fn
                    });
                }
                message.delete();
                message.channel.send(`Please do not advertise here ${member}`)
                // Warn member
            }
        }
    })
}