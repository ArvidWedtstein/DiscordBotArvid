const path = require('path')
const fs = require('fs')


module.exports = (client) => {
    const baseFile = 'command-base.js'
    const commandBase = require(`./${baseFile}`)
    commandBase.loadPrefixes(client);

    const commands = []

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile && file !== 'load-commands.js') {
                function lineCount( text ) {
                    var nLines = 0;
                    for( var i = 0, n = text.length;  i < n;  ++i ) {
                        if( text[i] === '\n' ) {
                            ++nLines;
                        }
                    }
                    return nLines;
                }
            }

        }
    }
    
    readCommands('.')

    //commandBase.listen(client);
}