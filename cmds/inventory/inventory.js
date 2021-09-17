const items = require('./items');
const inventorySchema = require('../../schemas/inventory-schema')
const c = require('ansi-colors');
const messageCounter = require('../../Stats/message-counter');

const itemsCache = {}

const inventoryslotsCache = {}
module.exports = (client) => {}

module.exports.addItem = async (guildId, userId, itemname, amount) => {
            const item = {
                name: itemname,
            }
            for (i = 0; i < amount; i++) {
                const result = await inventorySchema.findOneAndUpdate({
                    guildId,
                    userId,
                }, {
                    guildId,
                    userId,
                    $push: {
                        items: item
                    },
                }, {
                    upsert: true,
                }).catch((err) => {
                    console.log(err)
                })
            }
            console.log('Running findOneAndUpdate(item)')
            /*let test = await inventorySchema.findOne({
                guildId, 
                userId
            })

            if (!test) {
                test = await new inventorySchema({
                    guildId,
                    userId,
                    items: item
                }).save()
            } 
            let array = []
            let items = test.items
            for (const item of items) {
                let { name, icon } = item
                array.push(name)
                
            }
            if (array.indexOf(itemname)) {
                for (i = 0; i < amount; i++) {
                    const result = await inventorySchema.findOneAndUpdate({
                        guildId,
                        userId,
                    }, {
                        guildId,
                        userId,
                        $push: {
                            items: item
                        },
                    }, {
                        upsert: true,
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            } else {
                if (test.slots <= 0) {
                    return `Inventory full`
                } else {
                    const result2 = await inventorySchema.findOneAndUpdate({
                        guildId,
                        userId,
                    }, {
                        guildId,
                        userId,
                        $inc: {
                            slots: - 1
                        }
                    }, {
                        upsert: true,
                    }).catch((err) => {
                        console.log(err)
                    })
                }     
            }*/ 

            
            
            //itemsCache[`${guildId}-${userId}`] = result.items

            //return result.items
            
            
           return
            
}
module.exports.removeItem = async (guildId, userId, itemname, itemicon, amount) => {
            //console.log('Running findOneAndUpdate(item)')
            const item = {
                name: itemname
            }

            for (i = 0; i < amount; i++) {
                const result = await inventorySchema.findOneAndUpdate({
                    guildId,
                    userId,
                }, {
                    guildId,
                    userId,
                    $pull: {
                        items: item
                    }
                }, {
                    upsert: true,
                }).catch((err) => {
                    console.log(err)
                })
                if (!result) {
                    await new inventorySchema({
                        guildId,
                        userId
                    }).save()
                } 
            }
            
            /*let test = await inventorySchema.findOne({
                guildId, 
                userId
            })
            if (!test) {
                test = await new inventorySchema({
                    guildId,
                    userId,
                    items: item
                }).save()
            } 
            let array = []
            let items = test.items
            for (const item of items) {
                let { name, icon } = item
                array.push(name)
            }
            let array2 = []
            if (array.indexOf(itemname)) {
                console.log('true')
                for (i = 0; i < amount; i++) {
                    const result = await inventorySchema.findOneAndUpdate({
                        guildId,
                        userId,
                    }, {
                        guildId,
                        userId,
                        $pull: {
                            items: item
                        }
                    }, {
                        upsert: true,
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            } else {
                return
            }*/ 
        return 
}
module.exports.giveItem = async (guildId, userId2, itemname, amount, authorId) => {
    //console.log('Running findOneAndUpdate(item)')
    const item = {
        name: itemname
    }
    
    // Remove item from senders inventory
    console.log(amount);
    for (let i = 0; i < amount; i++) {
        let userId = authorId;
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $pull: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err) => {
            console.log(err)
        })
        if (!result) {
            await new inventorySchema({
                guildId,
                userId
            }).save()
        } 
    }
    
    // Add item to receivers inventory
    for (let i = 0; i < amount; i++) {
        let userId = userId2;
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $push: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err) => {
            console.log(err)
        })
        console.log(result.items)
        if (!result) {
            await new inventorySchema({
                guildId,
                userId,
                items: item
            }).save()
        } 
    }
    
return 
}
module.exports.getItems = async (guildId, userId) => {
    const cachedValue = itemsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }
    console.log('Running findOne(getitems)')

    const result = await inventorySchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let items = {};
    
    if (result) {
        items = result.items
    } else {
        console.log('Inserting a document')
        await new inventorySchema({
            guildId,
            userId,
            //items
        }).save()
        items = ''
    }
    
    //itemsCache[`${guildId}-${userId}`] = items
    
    return items
    
}
