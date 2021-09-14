const fs = require('fs');
let refreshtime = 10

module.exports = async (client) =>{

    
    var d = new Date();
    setInterval(async () =>{
        
        const dformat = [
            d.getDate(),
            d.getMonth()+1,
            d.getFullYear()
        ].join('/')
        const dat = `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}` 
        let presencetext = []
        client.users.cache.each(async (member) => {
            Promise.resolve(member).then(async function() {
                /*var presence = member.presence.activities.length ? member.presence.activities.filter(x=>x.type === "PLAYING") : null;
                if (presence == null) {
                    return
                }
                const userpresence = member.presence.activities.filter(x=>x.type === "PLAYING")
                //console.log(userpresence.toString())
                const presenceuser = presence.toString()*/
                var presence = member.presence.activities.filter(x=>x.type === "PLAYING") || null;
                
                if (!presence.toString() || presence.toString() == 'undefined') {
                    //presencetext = []
                    return
                } else if (presence.toString() == '[]') {
                    //presencetext = []
                    return
                } else {
                    presencetext.push(presence[0].name)
                    //await console.log(`${member} is playing ${presencetext}` )
                    presenceupdate(presencetext, member)
                    return
                }
            
            })  
        })
        async function presenceupdate(array, member) {
            try {
                console.log(array)
                // try to read file
                await fs.promises.readFile(`./logs/ActivityLog/activityLog - ${dat}.txt`)
                let text = fs.readFileSync(`./logs/ActivityLog/activityLog - ${dat}.txt`).toString();
    
                await fs.writeFile(`./logs/ActivityLog/activityLog - ${dat}.txt`, `${d.toLocaleTimeString()}` + ' : ' + `${member}` + `${array}` + `\n` + `${text}`, err => {
                    if (err) throw err;
                });
              } catch (error) {
                // create empty file, because it wasn't found
                await fs.promises.writeFile(`./logs/ActivityLog/activityLog - ${dat}.txt`, `${d.toLocaleTimeString()}` + ' : ' + `${member}` + `${array}`, err => {
                    if (err) throw err;
                });
            }
        }
        
    }, 1000 * refreshtime);
}