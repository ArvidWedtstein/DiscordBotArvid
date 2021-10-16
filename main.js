const Discord = require('discord.js');
const Commando = require('discord.js-commando')
const { MongoClient } = require('mongodb');
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;
const fs = require('fs');
const config = require("./config.json");
const package = require('./package-lock.json');    
const path = require('path');
const mongo = require('./mongo');
const c = require('ansi-colors');
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

const updateConfig = async () => {
    let txt = '';
    fs.readFile('./config.json', 'utf8', function(err, data){
      
        data = data.replace(config.version, package.version);
        fs.writeFile('./config.json', data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        }); 
    });
      
}   

module.exports = client;


client.on('ready', async () => {
    
    console.log(`${lineupper}\n${vert} ${initsuccess} ${vert}\n${linelower2}`)
    console.log(`${vert}       Version: ${package.version}      ${vert}\n${linelower2}`)
    updateConfig();
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
    console.log(`${vert}  ${c.yellowBright(`Commands Loaded ${c.white('➣')}  ${c.greenBright(i)}`)}   ${vert}\n${linelower2}`)
    console.log(`${vert}         ${c.yellow(`Events Log`)}        ${vert}\n${linelower2}`)
    
    


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

    // Check current schoolclass
    timesystem(client);

    // Lottery
    //lottery(client);

    // Check for nitro boosters
    serverboost(client);


    // Twitch test
    twitch(client);

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
const timesystem = require('./Stats/currentTime');
const voiceactivity = require('./Stats/voicechannelLog');
const { loadColors } = require('./cmds/icon/icon');
const twitch = require('./cmds/test/twitch');




client.login(process.env.CLIENT_TOKEN);