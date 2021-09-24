const Discord = require('discord.js');
const Commando = require('discord.js-commando')
const { MongoClient } = require('mongodb');
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;



const fs = require('fs');
const config = require("./config.json");
const path = require('path');
const mongo = require('./mongo');
const c = require('ansi-colors');
const economy = require('./economy');
const messageCountSchema = require('./schemas/message-count-schema');
const profileSchema = require('./schemas/profileschema');
require('dotenv').config();

// Extend EventEmitter
const EventEmitter = require('events');
const emitter = new EventEmitter();
EventEmitter.defaultMaxListeners = 50
emitter.setMaxListeners(50);

// Client Config
const client = new Commando.CommandoClient({
    owner: config.owner,
    commandPrefix: config.prefix,
    restTimeOffset: 0,
    invite: process.env.SUPPORT_SERVER_INVITE,
    disableMentions: 'everyone',
    unknownCommand: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});


// Initialize Discord Buttons - Remove when discord.js supports buttons & menus
const dbs = require('discord-buttons')
dbs(client)

let lineupper = `╭───────────────────────────╮`;
let vert = '│'
let linelower2 = '├───────────────────────────┤'
let linelower = '╰───────────────────────────╯';
const initfailed = `${c.white(`Meme Bot Status: ${c.redBright(`Failed ${c.symbols.cross}`)}`)}`;
const initsuccess = `${c.white(`Meme Bot Status: ${c.greenBright(`Online ${c.symbols.check}`)}`)}`;
// Database setup
client.setProvider(
    MongoClient.connect(process.env.REMOTE_MONGODB, {
        useUnifiedTopology: true,
        //useFindAndModify: false
    })
        .then((client) => {
            return new MongoDBProvider(client, 'MemeBot')
        }) 
        .catch((err) => {
            
            console.error(c.bgBlackBright(c.redBright(err)));
            console.log(`${lineupper}\n${vert} ${initfailed} ${vert}\n${linelower2}`)
    }) 
)



module.exports = client;


client.on('ready', async () => {
    
    console.log(`${lineupper}\n${vert} ${initsuccess} ${vert}\n${linelower2}`)

    



    //Set Activity
    client.user.setActivity({
        name: "YOU",
        type: "WATCHING",
        url: "https://arvidw.space/About"
    });

    //console.log(c.white(c.bgRed(`T${c.bgRedBright(`h${c.bgYellow(`e ${c.bgGreen(`M${c.bgGreenBright(`e${c.bgBlue(`m${c.bgBlueBright(`e ${c.bgCyan(`L${c.bgCyanBright(`o${c.bgMagenta(`r${c.bgMagentaBright(`d ${c.blueBright(`is here!`)}`)}`)}`)}`)}`)}`)}`)}`)}`)}`)}`)))
    client.registry
        .registerGroups([
            ['misc', 'Random commands'],
            ['admin', 'Administrator commands'],
            ['features', 'Features commands'],
            ['games', 'Game commands'],
            ['music', 'Music commands'],
            ['reaction', 'Reaction commands'],
            ['stats', 'Stat commands'],
            ['level', 'Level commands'],
            ['language', 'Language commands'],
            ['inventory', 'Inventory commands'],
            ['joinleave', 'Joinleave commands'],
            ['prefix', 'change prefix'],
            ['test', 'test commands'],
            ['economy', 'money commands'],
            ['icon', 'Icon Color commands']
        ])
        .registerDefaultTypes()
        .registerCommandsIn(path.join(__dirname, 'cmds'));
        
        
    let i = 0;
    client.registry.groups.forEach((g) => {
        g.commands.forEach((c) => {
            i++;
            //console.log(`${vert} ${c.memberName}`)
        })
    });
    console.log(`${vert}  ${c.yellowBright(`Commands Loaded ${c.white('➣')}  ${c.greenBright(i)}`)}   ${vert}\n${linelower}`)
    await mongo()

        
    // Start anti AD
    antiAd(client);
    
    // Start Message Logging
    msgLog(client);

    // Start Swearfilter
    swearFilter(client);

    // Check for swearuses
    autoStaffSwearFilter(client, Discord);

    //Start membercounting
    memberCounter(client);


    // Start MCstats
    //mcOnline(client);

    // Count Messages
    messageCount(client);

    //Start Welcome & Leave Script
    welcome(client);
    leave(client);

    clientJoin(client);


    // Load levelsystem
    levels(client);

    // Load Inventory
    inventory(client);
      
    // Check for mute
    muteCheck(client);


    // ProgrammingRoleClaim
    programmingrole(client);

    // OS role claim
    osrole(client);

    
    setTimeout(async () => {
        // shop
        await shop(client);

        // Check for birthday - Possible reward?
        await birthday(client);
    }, 2000);
    

    // Load Languages
    loadLanguages(client);

    // Load Icon Colors
    loadColors(client);


    checkemoji(client);


    //Antispam
    antispam(client);

    
    // Check What Users are playing
    //checkUserActivity(client)


    // Lottery
    //lottery(client);

    const getApp = async () => {
        const app = client.api.applications(client.user.id);
        
        return app
    }
    // Types //
    //SUB_COMMAND	1	
    // SUB_COMMAND_GROUP	2	
    // STRING	3	
    // INTEGER	4	Any integer between -2^53 and 2^53
    // BOOLEAN	5	
    // USER	6	
    // CHANNEL	7	Includes all channel types + categories
    // ROLE	8	
    // MENTIONABLE	9	Includes users and roles
    // NUMBER	10

    const guildId = '524951977243836417'
    /*await getApp().commands.post({
        data: {
            name: 'slap',
            description: 'slap a user',
            options: [
                {
                    name: 'name',
                    description: 'Targets name',
                    required: true,
                    type: 3,
                    choices: [
                        {
                            name: "Dog",
                            value: "animal_dog"
                        },
                        {
                            name: "Cat",
                            value: "animal_cat"
                        },
                        {
                            name: "Penguin",
                            value: "<:MacOS:836906360040849438>"
                        }
                    ]
                }
            ]
        }
    })
    await getApp().commands.post({
        data: {
            name: 'p',
            description: 'profile',
        }
    })
    await getApp().commands.post({
        data: {
            name: "info",
            description: "Some info about me😐"
        }
    })
    await getApp().commands.post({
        data: {
            name: 'steal',
            description: 'steal a emoji',
            options: [
                {
                    name: 'name',
                    description: 'Emoji name',
                    required: true,
                    type: 3
                }
            ]
        }
    })*/

    
    
    /*const commands = await getApp(guildId).commands.get()
    
    console.log(commands)*/
    /*client.ws.on('INTERACTION_CREATE', async (interaction) => {
        if (interaction.type == 3) return
        const { name, options } = interaction.data;
        const command = name.toLowerCase()
        const guild = client.guilds.cache.get(guildId)

        

        const args = {}
        if (options) {
            for (const option of options) {
                const { name, value } = option
                args[name] = value
            }
        }
        if (command === 'steal') {
            for (const arg in args) {
                const value = args[arg]
                const parsedEmoji = Util.parseEmoji(value);
    
                if (parsedEmoji.id) {
                    const extension = parsedEmoji.animated ? ".gif" : ".png";
    
                    const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
                    guild.emojis
                        .create(url, parsedEmoji.name)
                        .then((emoji) => {
                            let embedsteal = new MessageEmbed()
                                .setColor(config.botEmbedHex)
                                .setAuthor(`Added`, emoji.url)
                            reply(interaction, embedsteal)
                        });
                }
            }
        }
        if (command === 'slap') {
            let embedslap = new Discord.MessageEmbed()
                .setColor('ff0000')

                .setImage("https://media1.tenor.com/images/e7240cfd3b00d219056296e21e3b8633/tenor.gif")
            
            for (const arg in args) {
                const value = args[arg]
                embedslap.setTitle(value)
            }
            reply(interaction, embedslap)
        }
        if (command === 'p') {
            const userrole = interaction.member.user;
            const user = interaction.user;
            const guildId = interaction.guild_id
            const userId = userrole.id  
      
            let xptonextlevel = ''
    
            const result = await messageCountSchema.findOne({ 
                guildId,
                userId
            })
            let messages = '';
            if (!result) {
                messages = '0'
            } else if (!result.messageCount) {
                messages = '0'
            } else {
                messages = result.messageCount;
            }
            let birthday = '';
    
            const birthdayresult = await profileSchema.findOne({
                userId
            })
            if (!birthdayresult) {
                birthday = 'Unknown'
            } else if (birthdayresult.birthday == '1/1') {
                birthday = 'Unknown'
            } else {
                birthday = birthdayresult.birthday;
            }
            

        
            // Get Animated ErlingCoin
            const erlingcoin = client.emojis.cache.get('853928115696828426');
    
            //let presence = user.presence.activities.length ? user.presence.activities.filter(x=>x.type === "PLAYING") : null;
            let Coins = await economy.getCoins(guildId, userId);
            let xp = await levels.getXP(guildId, userId);
            let userlevel = await levels.getLevel(guildId, userId);
            let xptonextlev = userlevel / 10
            xptonextlevel = xptonextlev * xptonextlev * 210
            let color = await economy.getColor(guildId, userId);

            let embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`${userrole.username}'s Profile`, `https://cdn.discordapp.com/${userrole.avatar}.jpg`)
                //.setAuthor(`${userrole.username}'s Profile`, `${userrole.discriminator}`)
                .addField('Birthday🎂: ', birthday, true)
                //.addField('Joined Discord: ', user.createdAt)
                .addField(`ErlingCoin${Coins === 1 ? '' : 's'}${erlingcoin}: `, Coins)
                .addField('Level:', userlevel, true)
                .addField('XP: ', xp, true)
                .addField('XP To Next Level: ', xptonextlevel - xp, true)
                .addField("Messages Sent: ", messages)
                //.addField("Game: ", `${presence && presence.length ? presence[0].name : 'None'}`)

    
            
            reply(interaction, embed)
        }*/

    
    // Check for nitro boosters
    serverboost(client);


    // Voice Channel Activity
    //voiceactivity(client);


    // Botembedhex alternative: "#49FFE9"
    
    // ARK Raid Alert
    //arkraidalert(client);

    // Slash-Command Handler

    const baseFile = 'slash-commands.js'
    const commandBase = require(`./SlashCommands/${baseFile}`)

    /*const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option);
            }
        }
    }*/
    //readCommands('SlashCommands');
    // Icon HEX gradient: #FFB712 #FF004A

    // Enable / Disable commands
    /*this.client.registry.groups.forEach((e) => {
        if (e.id === 'music') {
            e.commands.forEach((c) => {
                if (c.id === 'input') {
                    c.setEnabledIn(guild, false)
                }
            })
        }
    })*/
})

const levels = require('./levels');
const commandStats = require('./Stats/commandStats')
const inventory = require('./cmds/inventory/inventory')
const msgLog = require ("./cmds/admin/messageLog");
const poll = require("./cmds/misc/poll.js");
const swearFilter = require("./filters/swearfilter.js");
const autoStaffSwearFilter = require("./filters/autoStaffSwearFilter.js");
const antiAd = require('./cmds/admin/anti-ad');
const { loadLanguages } = require('./cmds/language/language.js');
const mcOnline = require('./Stats/mcOnline');
const checkUserActivity = require('./Stats/checkUserGame');
const memberCounter = require('./Stats/memberCounter');
const messageCount = require('./Stats/message-counter');
const welcome = require('./cmds/joinleave/welcome');
const leave = require('./cmds/joinleave/leave');
const clientJoin = require('./cmds/joinleave/botjoin')
const muteCheck = require('./cmds/admin/mutecheck');
const birthday = require('./cmds/features/birthday');   
// Role Init
const programmingrole = require('./cmds/reaction/programmingrolereact');
const osrole = require('./cmds/reaction/OSrolereact');
const shop = require('./cmds/economy/shop')

const checkemoji = require('./cmds/inventory/checkforemoji')
const antispam = require('./cmds/admin/anti-spam');
const lottery = require('./cmds/features/lottery')
const serverboost = require('./cmds/joinleave/nitrobooster')
const arkraidalert = require('./events/ArkRaidAlert')

const voiceactivity = require('./Stats/voicechannelLog');
const { loadColors } = require('./cmds/icon/icon');





client.login(process.env.CLIENT_TOKEN);