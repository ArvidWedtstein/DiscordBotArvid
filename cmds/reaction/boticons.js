const emojis = {
    musicwave: '859394671143026699',
    gear: '862388280763088907',
    danger: '862388227787718686',
    left2: '859394321143562260',
    right2: '859394347240652810',
    on: '862269430184935434',
    off: '862269414593003530',
    time: '862388254988959825',
    skip: '859394769112924191',
    pause: '859394381567623210',
    audiocable: '859394610173837352',
    volume: '859394643431129138',
    dice: '862437381684330597',
    unavailable: '863017287246282773',
    maintenance: '863016752803217410',
    contact: '863017008986456074',
    bug: '863016972450660352',
    info: '862388085886156850',
    add: '863016985218383922',
    skyrim: '873630321713774602',
    doubt: '858104735978356807',
    sign: '862405672342913046',
    settings: '862388280763088907',
    secure: '879622426948943882',
    firework: '879649969794088961',
    banhammer: '885407737226330143',
    thisisfine: '885428085472788480',
    ticket: '885429030055215104'
}

//const emoji = (client, emoji) => client.emojis.cache.find((e) => e.id === emojis[emoji])
module.exports = (client, emojiname) => {
    return client.emojis.cache.find((e) => e.id === emojis[emojiname])
}