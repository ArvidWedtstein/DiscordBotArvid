const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class ValgomatCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'valgomat',
            aliases: ['valg'],
            group: 'features',
            memberName: 'valgomat',
            description: 'valgomat',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            guildOnly: true,
            guarded: false
        })
    }

    async run(message, args) {
        const guildId = message.guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);

        const questions = [
            {
                S: 'Bør Norge ta imot flere flyktninger enn idag',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi innføre flere tiltak for å redusere bruken av bil',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør Norge samarbeide mindre med EU',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør Norge fortsatt være medlem av NATO',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi fortsette med vaksinepass',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør skattene på inntekt økes',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør flere private få drive barnehager og skoler',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi slutte å lete etter olje',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi beskytte den kristne kulturen i Norge sterkere',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør det være fritt behandlingsvalg på sykehus i Norge',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør det bli vanskeligere å ansette folk midlertidig',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi bruke mer offentlige penger på distriktene',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør det være straff for å ha narkotika til eget bruk',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør det strammes inn hvor mye kommuner kan ta i eiendomsskatt',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør bompenger fjernes',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør fordelene for elbil forlenges',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør retten til abort utvides',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør kommuner og fylker få lov til å oppheve sammenslåing',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør kommunene ha lov til å innføre utslippfrie soner',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør arveavgiften innføres igjen',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            },
            {
                S: 'Bør vi fortsattr satse på vindkraft på land',
                p: {
                    mgd: false,
                    v: false,
                    h: false,
                    frp: false,
                    sp: false,
                    r: false,
                    pdk: false,
                    ap: false,
                    sv: false
                }
            }
        ];
        
    }
}