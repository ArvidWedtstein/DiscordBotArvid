const commandSchema = require('../schemas/command-schema')
const c = require('ansi-colors')
const client = require('../main')

module.exports.cmdUse = async (guildId, command) => {

            let result = await commandSchema.findOne({
                guildId
            })
            
            if (!result) {
                var commandarray = []
                client.registry.groups.forEach((g) => {
                    g.commands.forEach((c) => {
                        commandarray.push({
                            cmdname: c.name,
                            uses: 0
                        })
                    })
                })

                result = await new commandSchema({
                    guildId,
                    commands: commandarray
                }).save()
            }

            /*if (!(command in result.commands)) {
                return `No command found`
            }*/
            let cmdarray = []
            for (let i in result.commands) {
                cmdarray.push(result.commands[i].cmdname)
            }
            if (!cmdarray.includes(command)) {
                console.log('cmd not found')
                result.commands.push({
                    cmdname: command,
                    uses: 0
                })
                result = await commandSchema.findOneAndUpdate({
                    guildId,
                }, {
                    guildId,
                    commands: result.commands
                }, {
                    upsert: true
                }).catch((err) => {
                    console.log(c.red(err))
                })
            } 
            client.registry.groups.forEach((g) => {
                g.commands.forEach(async (c) => {
                    if (command == c.name) {
                        for (var i in result.commands) {
                            if (result.commands[i].cmdname == command) {
                                result.commands[i].uses += 1
                                await commandSchema.findOneAndUpdate({
                                    guildId,
                                }, {
                                    guildId,
                                    commands: result.commands
                                }, {
                                    upsert: true
                                }).catch((err) => {
                                    console.log(c.red(err))
                                })
                            }
                        }
                    }
                })
            })
}

module.exports.cmdUsages = async (guildId, command) => {

    let result = await commandSchema.findOne({
        guildId
    })
    /*if (!(command in result.commands)) {
        return `No command found`
    }*/
    let cmdarray = []
    for (let i in result.commands) {
        cmdarray.push(result.commands[i].cmdname)
    }
    if (!cmdarray.includes(command)) {
        console.log('cmd not found')
        result.commands.push({
            cmdname: command,
            uses: 0
        })
        result = await commandSchema.findOneAndUpdate({
            guildId,
        }, {
            guildId,
            commands: result.commands
        }, {
            upsert: true
        }).catch((err) => {
            console.log(c.red(err))
        })
    } 
    let uses = 0;
    client.registry.groups.forEach((g) => {
        g.commands.forEach(async (c) => {
            if (command == c.name) {
                for (var i in result.commands) {
                    if (result.commands[i].cmdname == command) {
                        uses = result.commands[i].uses;
                        return uses;
                    }
                }
            }
        })
    })
    return uses;
}


