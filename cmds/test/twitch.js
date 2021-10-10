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
    }
    setInterval(run, 15000);
}