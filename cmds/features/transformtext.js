var letters = {
    a: '𝓪',
    b: '𝓫',
    c: '𝓬',
    d: '𝓭',
    e: '𝓮',
    f: '𝓯',
    g: '𝓰',
    h: '𝓱',
    i: '𝓲',
    j: '𝓳',
    k: '𝓴',
    l: '𝓵',
    m: '𝓶',
    n: '𝓷',
    o: '𝓸',
    p: '𝓹',
    q: '𝓺',
    r: '𝓻',
    s: '𝓼',
    t: '𝓽',
    u: '𝓾',
    v: '𝓿',
    w: '𝔀',
    y: '𝔂',
    x: '𝔁',
    z: '𝔃',
};
var letters2 = {
    a: '𝖆',
    b: '𝖇',
    c: '𝖈',
    d: '𝖉',
    e: '𝖊',
    f: '𝖋',
    g: '𝖌',
    h: '𝖍',
    i: '𝖎',
    j: '𝖏',
    k: '𝖐',
    l: '𝖑',
    m: '𝖒',
    n: '𝖓',
    o: '𝖔',
    p: '𝖕',
    q: '𝖖',
    r: '𝖗',
    s: '𝖘',
    t: '𝖙',
    u: '𝖚',
    v: '𝖛',
    w: '𝖜',
    x: '𝖝',
    z: '𝖟',
};
   let array = []
   const fs = require('fs');
   const Discord = require('discord.js');
   const language = require('../language/language')
   const Commando = require('discord.js-commando')
   const commandStats = require('../../Stats/commandStats')
   module.exports = class TransformTextCommand extends Commando.Command {
       constructor(client) {
           super(client, {
               name: 'transformtext',
               aliases: ['tt'],
               group: 'features',
               memberName: 'transformtext',
               description: 'transform a text',
               userPermissions: ['ADD_REACTIONS'],
               argsType: 'single'
           })
       }
       
       async run(message, args) {
            message.delete()
            const { guild } = message
            const guildId = guild.id
            commandStats.cmdUse(guildId, 'transformtext')
            for (let i = 0; i < args.length; i++) {
                array.push(letters[args[i]])
                //console.log(array)
            }
            message.channel.send(array.join(''))
       }
   }