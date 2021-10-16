const TwitchAPI = require('node-twitch').default
const Discord = require('discord.js')
const open = require('open');
let twitchloop = true;
module.exports = async (client) => {
    const twitch = new TwitchAPI({
        client_id: 'jbx4jhn5qfd8u1uamqp7sqgmspu7ao',
        client_secret: 'p9sjqd4jtqvudqcmx5pqn5ornvggrh'
    })
    let IsLiveMemory = false
    const run = async function Run() {
        try {
            await twitch.getStreams({ channel: "brawlhalla" }).then(async data => {
                const r = data.data[0];
                let ThisGuildOnly = client.guilds.cache.get("524951977243836417");
                const ChannelAnnounceLive = ThisGuildOnly.channels.cache.find(x => x.id === "896474616103579648");
                if (r !== undefined) {
                    if (r.type === "live") {
                        if (twitchloop) {
                            open('https://www.twitch.tv/brawlhalla');
                            IsLiveMemory = true;
                            twitchloop = false;
                            const notificationusers = ['271288025428918274', '320137922370338818']
                            for (let i = 0; i < notificationusers.length; i++) {
                                let user = ThisGuildOnly.members.cache.get(notificationusers[i]);
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${r.title}`)
                                    .setAuthor(`Brawlhalla is now streaming live!`)
                                    .setDescription(`Viewers: ${r.viewer_count}`)
                                    .setThumbnail(r.getThumbnailUrl({width: 500, height: 500}))
                                user.send(embed)
                            }
                        }
                        
                    } else {
                        IsLiveMemory = false;
                    }
                    ChannelAnnounceLive.setName(`Brawlhalla: ${IsLiveMemory === true ? 'Live' : 'not live'}`);
                } else {
                    IsLiveMemory = false;
                    ChannelAnnounceLive.setName(`Brawlhalla: ${IsLiveMemory === true ? 'Live' : 'not live'}`);
                }
                
            })
        } catch (err) {
            console.error(err);
        };
        
    }
    setInterval(run, 15000);
}