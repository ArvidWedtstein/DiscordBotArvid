const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { YTSearcher } = require('ytsearcher')
const queue = new Map();
const playlistSchema = require('../../schemas/playlist-schema')
const tempmsg = require('../misc/temporary-message')
const { MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons')
/*const searcher = new YTSearcher({
    key: "AIzaSyCg73HRf0mO9nr9YGfHw4rhi8eIfO15HO0",
    revealed: true
});*/
const language = require('../language/language')
const Commando = require('discord.js-commando')
const level = require('../../levels')
const config = require('../../config.json')
const icons = require('../icon/icon')
const playemojis = [
    "play",
    "skip",
    "stop",
    "resume",
    "pause",
    "loopone",
    "loopall",
    "loopstop",
    "music",
    "cable",
    "audio"
]
let songint = 0
module.exports = class MusicCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'music',
            aliases: ['m', 'musikk'],
            group: 'music',
            memberName: 'music',
            description: 'get music menu',
            guildOnly: true,
            userPermissions: ['CONNECT'],
            clientPermissions: [
                'SPEAK', 
                'CONNECT', 
                'STREAM', 
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            argsType: 'multiple',
            details: 'play music from a url or by searching\nYou can also skip, pause and make playlists!'
        })
    }
    
    async run(message, args) {
        const { guild, author, member } = message
        let music = {}
        const getEmoji = emojiName => this.client.emojis.cache.find((emoji) => emoji.name === emojiName);
        for (let i = 0; i < playemojis.length; i++) {
            const emoji = getEmoji(playemojis[i])
            music[playemojis[i]] = emoji
        }  
        c
        const guildId = guild.id;
        const userId = author.id;
        
        const voice_channel = member.voice.channel;

        /*if (!voice_channel) {
            return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`)
        }
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.reply(`${language(guild, 'PERMISSION_ERROR')}.`)
        if (!permissions.has('SPEAK')) return message.reply(`${language(guild, 'PERMISSION_ERROR')}.`)*/

        const server_queue = queue.get(guild.id)
        if (!args[0]) {
            menu(message, music, server_queue)
        } else if (args[0] == 'play') {
            if (!voice_channel) {
                return tempmsg(message.channel, `${language(guild, 'VOICE_CHANNEL')}.`, 30)
                //return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`)
            } else {
                /*let result = await searcher.search(args.join(" "), { type: "video" })
                const songInfo = await ytdl.getInfo(result.first.url)*/
                
                let song = {}
                /*let song = { 
                    title: songInfo.videoDetails.title, 
                    url: songInfo.videoDetails.video_url,
                    img: songInfo.videoDetails.thumbnail,
                    duration: songInfo.videoDetails.duration
                }*/
                
                // Give user xp
                //level.addXP(guildId, userId, 50, message)
                if (!args.length) return tempmsg(message.channel, 'You need to send the second argument', 30)
        
                if (ytdl.validateURL(args[0])) {
                    const song_info = await ytdl.getInfo(args[0]);
                    song_info.fade_in_start_milliseconds = false;
                    song_info.loudness = 100;
                    
                    song = { 
                        title: song_info.videoDetails.title, 
                        url: song_info.videoDetails.video_url,
                        img: song_info.videoDetails.thumbnail,
                        duration: song_info.videoDetails.duration
                    }
                } else {
                    //If the video is not a URL then use keywords to find that video.
                    const video_finder = async (query) => {
                        const videoResult = await ytSearch(query);
                        
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                        
                        /*let videoResult = await searcher.search(query)
                        return videoResult.first*/
                    }
                    const video = await video_finder(args.join(" "));
                    if (video) {
                        //console.log('video')
                        song = { title: video.title, url: video.url, img: video.thumbnail, duration: video.duration }
                    } else {
                        tempmsg(message.channel, `${language(guild, 'MUSIC_CONNECTERROR')}`, 30);
                    }
                }
                if (!server_queue) {

                    const queue_constructor = {
                        voice_channel: voice_channel,
                        text_channel: message.channel,
                        connection: null,
                        songs: [],
                        playing: true,
                        loopone: false,
                        loopall: false
                    }
        
                    // Set quene
                    queue.set(message.guild.id, queue_constructor);

                    // Add song to quene
                    queue_constructor.songs.push(song);
                    //songs.push(song)

                    //console.log(queue_constructor)
                    try {
                        let connection = await voice_channel.join();
                        queue_constructor.connection = connection;
                        video_player(message.guild, queue_constructor.songs[0])
                    } catch (err) { 
                        queue.delete(message.guild.id);
                        //message.reply(`${language(guild, 'MUSIC_CONNECTERROR')}`);
                        tempmsg(message.channel, `${language(guild, 'MUSIC_CONNECTERROR')}`, 10);
                        throw err;
                    }
                } else {
                    // If there already is a song in the quene
                    server_queue.songs.push(song);
                    
                    let embed = new Discord.MessageEmbed()
                        .setColor('ff0000')
                        .setTitle(`📥 **${song.title}** ${language(guild, 'MUSIC_ADDQUEUE')}.`)
                        .setThumbnail(song.img)
                        .setFooter(`Added by ${message.author.username}`, `${message.author.displayAvatarURL()}`)
                    
                    //return await server_queue.text_channel.send(embed);
                    return await tempmsg(server_queue.text_channel, embed, 10);
                    //return message.channel.send(`📥 **${song.title}** added to queue!`)
                }
            }

        } else if (args[0] == 'skip') {
            skip_song(message, server_queue);
        } else if (args[0] == 'stop') {
            
            stop_song(message, server_queue);
        } else if (args[0] == 'list') {
            list_songs(message, server_queue);
        } else if (args[0] == 'save') {
            save_queue(message, server_queue);
        } else if (args[0] == 'load') {
            load_queue(message, server_queue);
        } else if (args[0] == 'playlist') {
            playlist_songs(message, server_queue);
        } else if (args[0] == 'v') {
            volume(message, args, server_queue);
        } else if (args[0] == 'p') {
            pause_song(message, server_queue);
        } else if (args[0] == 'r') {
            resume_song(message, server_queue);
        } else if (args[0] == 'loop') {
            if (args[1] == 'one') {
                loop_one(message, server_queue);
            } else if (args[1] == 'all') {
                loop_all(message, server_queue);
            } else if (args[1] == 'off') {
                loop_off(message, server_queue);
            }
        } 
        this.client.on('clickButton', async (btn) => {
            btn.reply.defer();
            if (btn.id == 'play') {
                
            } else if (btn.id == 'skip') {
                skip_song(message, server_queue);
            } else if (btn.id == 'stop') {
                stop_song(message, server_queue);
            } else if (btn.id == 'loopone') {
                loop_one(message, server_queue);
            } else if (btn.id == 'loopall') {
                loop_all(message, server_queue);
            } else if (btn.id == 'loopstop') {
                loop_off(message, server_queue);
            }
        })
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            // Remove all user reactions
            /*const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(userId);
                }
            } catch (error) {
                console.error('Failed to remove reactions.');
            }*/
            if (reaction.message.channel.id == message.channel.id) {
                switch (reaction.emoji) {
                    case music.pause: 
                        if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        await reaction.users.remove(user.id);
                        await reaction.users.remove(this.client.id);
                        reaction.message.react(music.resume)
                        pause_song(message, server_queue);
                    break;
                    case music.resume:
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        await reaction.users.remove(user.id);
                        await reaction.users.remove(this.client.id);
                        reaction.message.react(music.pause)
                        resume_song(message, server_queue);
                    break; 
                    case music.stop:
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        stop_song(message, server_queue);
                        await reaction.users.remove(user.id);
                    break;
                    case music.skip:
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        skip_song(message, server_queue);
                        await reaction.users.remove(user.id);
                    break;
                    case music.loopone: 
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        loop_one(message, server_queue);
                        await reaction.users.remove(user.id);
                    break;
                    case music.loopall:
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        loop_all(message, server_queue);
                        await reaction.users.remove(user.id);
                    break;
                    case music.loopstop:
                        //if (!user.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
                        loop_off(message, server_queue);
                    break;
                }
            } else {
                return;
            }
        });
        
    }
}

async function menu(message, music, queue) {
    const { guild } = message
    
    const playbtn = new MessageButton()
        .setID('play')
        .setEmoji(icons(guild, 'play').id)
        .setStyle(2)
    const skipbtn = new MessageButton()
        .setID('skip')
        .setEmoji(music.skip.id)
        .setStyle(2)
    const stopbtn = new MessageButton()
        .setID('stop')
        .setEmoji(music.stop.id)
        .setStyle(2)
    const looponebtn = new MessageButton()
        .setID('loopone')
        .setEmoji(music.loopone.id)
        .setStyle(2)
    const loopallbtn = new MessageButton()
        .setID('loopall')
        .setEmoji(icons(guild, 'loopall').id)
        .setStyle(2)

    let embed = new Discord.MessageEmbed()
        .setColor(config.botEmbedHex)
        .setTitle(`${language(guild, 'MUSIC_MENU')}`)
        .setDescription(queue.songs[0].duration)
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL()}`)
    if (queue) {
        embed.setAuthor(`${language(guild, 'MUSIC_NOWPLAYING')} ${queue.songs[0].title}`, queue.songs[0].img)
        embed.setThumbnail(queue.songs[0].img)
    }

    //tempmsg(message.channel, embed, 30);
    let messageEmbed = await message.channel.send({
        embed: embed,
        buttons: [playbtn, skipbtn, stopbtn, looponebtn, loopallbtn]
    })
    .then((message) => {
        message.react(icons(guild, 'play'))
        message.react(music.skip)
        message.react(music.stop)
        message.react(music.loopone)
        message.react(icons(guild, 'loopall'))
        if (!queue) {
            message.react(music.pause)
        } else {
            if (queue.connection.dispatcher.paused) {
                message.react(music.resume)
            } else {
                message.react(music.pause)
            }
        }
        /*message.delete({
            timeout: 1000 * 30
        })*/
    })
    
    
    
    
    
    return
}
async function video_player(guild, song) {
    
    const server_queue = await queue.get(guild.id);
    if (!server_queue.connection) {
        return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`)
    }
    if (!song) {
        server_queue.voice_channel.leave();
        queue.delete(guild.id);
        
        return;
    }
    
    /*const dispatcher = server_queue.connection.play(stream, { seek: 0, volume: 1.0 })
        .on('finish', () => {
            
            server_queue.songs.shift()
            video_player(guild, server_queue.songs[0])
        })*/
    const stream = ytdl(song.url, { filter: 'audioonly' });
    server_queue.connection.play(stream)
        .on('finish', () => {
            //console.log(server_queue.loopone)
            if (server_queue.loopone) {
                //video_player(guild, server_queue.songs[0]);
                video_player(guild, server_queue.songs[songint]);
            } else if (server_queue.loopall) {
                video_player(guild, server_queue.songs[songint]);
                //server_queue.songs.push(server_queue.songs[songint])
                //server_queue.songs.shift()
            } else {
                //server_queue.songs.shift()
                //video_player(guild, server_queue.songs[0]);
                songint++
                video_player(guild, server_queue.songs[songint]);
                
            }
            //server_queue.songs.shift();
            
        });
        
    
    
    let embed = new Discord.MessageEmbed()
        .setColor(config.botEmbedHex)
        .setTitle(`**${language(guild, 'MUSIC_NOWPLAYING')}**`)
        //.addField(`c`, `**${song.title}** (${song.duration.seconds})`, true)
        .setFooter(`${icons(guid, 'audiowave')} ${song.title} (${song.duration.seconds})`)
        .setThumbnail(song.img)
        .setURL(song.url)
    let messageEmbed = await server_queue.text_channel.send(embed);

    

    //await server_queue.text_channel.send(`🎵 Now Playing **${song.title}**`)
    return
}
async function save_queue (message, server_queue) {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue.songs) {
        return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`);
    }
    let userplaylist = []
    for (let i = 0; i < server_queue.songs.length; i++) {
        userplaylist.push(server_queue.songs[i])
    }
    const guildId = message.guild.id
    const userId = message.author.id
    //console.log(userplaylist)
    const playlist = await playlistSchema.findOneAndUpdate(
        {
            guildId, 
            userId
        },
        {
            guildId,
            userId,
            playlist: userplaylist, 
        }, 
        {
            upsert: true,
            new: true,
        }
    )
    if (!playlist) {
        await new playlistSchema({
            guildId,
            userId,
            playlist: userplaylist
        }).save()
    }
    message.reply(`${language(guild, 'MUSIC_SAVEPLAYLIST')}`)
}

async function load_queue (message, server_queue) {
    const { guild } = message
    const voice_channel = message.member.voice.channel;
    const channel = message.channel
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    let connection = await voice_channel.join();
    const guildId = message.guild.id
    const userId = message.author.id
    const queue_constructor = {
        voice_channel: voice_channel,
        text_channel: channel,
        connection: connection,
        songs: [],
        playing: true,
        loopone: false,
        loopall: false
    }

    // Set quene
    queue.set(message.guild.id, queue_constructor);


    const result = await playlistSchema.findOne({
        guildId,
        userId
    })
    //server_queue = queue.get(message.guild.id)
    if (!result) {
        return message.reply(`${language(guild, 'MUSIC_NOPLAYLIST')}.`)
    } else {
        /*try {
            for (let index = 0; index < server_queue.songs.length; index++) {
                server_queue.songs.shift()
            }
            for (let i = 0; i < result.playlist.length; i++) {
                //queue_constructor.songs.push(result.playlist[i])
                server_queue.songs.push(result.playlist[i])
            }
            
            console.log(server_queue.connection)
            //queue_constructor.connection = connection;
            video_player(message.guild, server_queue.songs[songint])
            
            //video_player(message.guild, queue_constructor.songs[songint])
        } catch (err) { 
            //queue.delete(message.guild.id);
            message.reply(`${language(guild, 'MUSIC_CONNECTERROR')}! ${music.cable}`);
            throw err;
        }*/
        if (server_queue) {
            for (let index = 0; index < server_queue.songs.length; index++) {
                server_queue.songs.shift()
            }
            for (let i = 0; i < result.playlist.length; i++) {
                //queue_constructor.songs.push(result.playlist[i])
                server_queue.songs.push(result.playlist[i])
            }
        } else {
            songint = 0;
            for (let i = 0; i < result.playlist.length; i++) {
                queue_constructor.songs.push(result.playlist[i])
                //server_queue.songs.push(result.playlist[i])
                if (server_queue) {
                    server_queue.songs.push(result.playlist[i]);
                }
            }
            
            message.reply(`${language(guild, 'MUSIC_LOADPLAYLIST')}`)
            try {
                //video_player(message.guild, server_queue.songs[songint])
                video_player(message.guild, queue_constructor.songs[songint])
            } catch (err) { 
                //queue.delete(message.guild.id);
                message.reply(`${language(guild, 'MUSIC_CONNECTERROR')}! ${music.cable}`);
                throw err;
            }
        }
    }   
    return
}
async function playlist_songs (message) {
    
    const guildId = message.guild.id
    const userId = message.author.id

    const { guild } = message

    
    const result = await playlistSchema.findOne({
        guildId,
        userId
    })
    if (!result) {
        return message.reply(`${language(guild, 'MUSIC_NOPLAYLIST')}`)
    } else {
        let txt = ''
        for (let i = 0; i < result.playlist.length; i++) {
            txt += `- ${result.playlist[i].title}\n`
        }
        return message.reply(`${language(guild, 'MUSIC_PLAYLIST')}:\n**${txt}**`)
    }   
}

async function skip_song (message, server_queue) {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) {
        return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`);
    }
    
    server_queue.connection.dispatcher.end();
}

async function stop_song (message, server_queue) {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) {
        return message.member.voice.channel.leave();
    } 
    if (!server_queue.connection) {
        return message.member.voice.channel.leave();
    } 
    if (server_queue.connection) {
        return server_queue.voice_channel.leave();
    } 
    queue.delete(guild.id);
    server_queue.songs = [];
    songint = 0;
    server_queue.connection.dispatcher.end();
    //server_queue.voice_channel.leave();
    
    

}
async function pause_song (message, server_queue) {
    if (!server_queue) {
        server_queue = queue.get(message.guild.id)
    }
    console.log('1')
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) {
        queue.connection.dispatcher.pause(true)
        //return message.reply(`${language(guild, 'MUSIC_PAUSE')}.`)
    }
    if (server_queue.connection.dispatcher.paused) {
        return message.reply(`${language(guild, 'MUSIC_ALREADYPAUSE')}.`)
    } 
    server_queue.connection.dispatcher.pause(true)
    return message.reply(`${language(guild, 'MUSIC_PAUSE')}.`)
}

async function resume_song (message, server_queue) {
    const { guild } = message
    if (!server_queue) {
        server_queue = queue.get(message.guild.id)
    }
    
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    if (!server_queue.connection) {
        //return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`);
    } 
    if (server_queue.connection.dispatcher.resumed) {
        return message.reply(`${language(guild, 'MUSIC_ALREADYRESUME')}.`)
    } 
    server_queue.connection.dispatcher.resume(true)
    
    message.reply(`${language(guild, 'MUSIC_RESUME')}.`)
    

}
const volume = (message, args, server_queue) => {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    if (!server_queue.connection) {
        return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`);
    } 
    let percent = args[1] / 100
    
    message.reply(`${language(guild, 'MUSIC_VOLUME')} ${args[1]}%`)
    server_queue.connection.dispatcher.setVolume(percent)
}
const loop_all = (message, server_queue) => {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    server_queue.loopall = !server_queue.loopall;
    server_queue.loopone = false;

    if (server_queue.loopall === true) {
        message.reply(`${language(guild, 'MUSIC_LOOPALL')}.`)
    } else {
        message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
    }
}
const loop_one = (message, server_queue) => {
    const { guild } = message
    //if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue.connection) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    server_queue.loopone = !server_queue.loopone;
    server_queue.loopall = false;

    if (server_queue.loopone === true) {
        message.reply(`${language(guild, 'MUSIC_LOOPONE')}.`)
    } else {
        message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
    }
}
const loop_off = (message, server_queue) => {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    server_queue.loopall = false;
    server_queue.loopone = false;

    message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
}


const list_songs = (message, server_queue) => {
    const { guild } = message
    if (!message.member.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) {
        return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`)
    }
    let nowPlaying = server_queue.songs[songint];
    //level.addXP(guildId, userId, 50, message)
    let qMsg = `${language(guild, 'MUSIC_NOWPLAYING')} ${nowPlaying.title}\n-----------------------------------\n`

    for (var i = 1; i < server_queue.songs.length; i++) {
        qMsg += `${i}. ${server_queue.songs[i].title}\n`
    }
    
    message.channel.send('```' + qMsg + `Requested by: ${message.author.username} ` + '```');
}

