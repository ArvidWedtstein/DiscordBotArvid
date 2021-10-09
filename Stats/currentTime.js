module.exports = async (client) => {
    const guild = client.guilds.cache.get('524951977243836417');

    const channel = guild.channels.cache.get('892323762110869524');
    setInterval(() =>{
        statusCommand();
    }, 5 * 60 * 1000);
    statusCommand();
    function statusCommand() { // Handle status command
        let vert = '│'
        //console.log(`${vert}    Checking Skoletime     ${vert}`)
        const timer = {
            "Monday": [
                { "fag": "Samfunnsfag", "start": "0805", "slutt": "0850" },
                { "fag": "Samfunnsfag", "start": "0900", "slutt": "0945" },
                { "fag": "Driftsstøtte", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling", "start": "1150", "slutt": "1235" },
                { "fag": "Driftsstøtte", "start": "1235", "slutt": "1320" },
                { "fag": "Gym", "start": "1330", "slutt": "1415" },
                { "fag": "Gym", "start": "1420", "slutt": "1505" },
            ],
            "Tuesday": [
                { "fag": "Samfunnsfag", "start": "0805", "slutt": "0850" },
                { "fag": "Norsk", "start": "0900", "slutt": "0945" },
                { "fag": "Norsk", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling", "start": "1150", "slutt": "1235" },
                { "fag": "Brukerstøtte", "start": "1235", "slutt": "1320" },
                { "fag": "Driftsstøtte", "start": "1330", "slutt": "1415" },
                { "fag": "Klassens time", "start": "1420", "slutt": "1505" }
            ],
            "Wednesday": [
                { "fag": "YFF", "start": "0805", "slutt": "0850" },
                { "fag": "YFF", "start": "0900", "slutt": "0945" },
                { "fag": "YFF", "start": "0950", "slutt": "1035" },
                { "fag": "YFF", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "YFF", "start": "1150", "slutt": "1235" },
                { "fag": "YFF", "start": "1235", "slutt": "1320" },
                { "fag": "YFF", "start": "1330", "slutt": "1415" },
                { "fag": "YFF", "start": "1420", "slutt": "1505" }
            ],
            "Thursday": [
                { "fag": "Norsk", "start": "0805", "slutt": "0850" },
                { "fag": "Norsk", "start": "0900", "slutt": "0945" },
                { "fag": "Utvikling", "start": "0950", "slutt": "1035" },
                { "fag": "Driftsstøtte", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" }
            ],
            "Friday": [
                { "fag": "Brukerstøtte-Dybdelære", "start": "0805", "slutt": "0850" },
                { "fag": "Utvikling-Dybdelære", "start": "0900", "slutt": "0945" },
                { "fag": "Driftsstøtte-Dybdelære", "start": "0950", "slutt": "1035" },
                { "fag": "Brukerstøtte-Dybdelære", "start": "1035", "slutt": "1120" },
                { "fag": "Mat", "start": "1120", "slutt": "1150" },
                { "fag": "Utvikling-Dybdelære", "start": "1150", "slutt": "1235" },
                { "fag": "Driftsstøtte-Dybdelære", "start": "1235", "slutt": "1320" },
                { "fag": "Utvikling-Dybdelære", "start": "1330", "slutt": "1415" }
            ]
        }
        const d = new Date()
        let nameOfDay;
        let dayOfWeekNumber = d.getDay();
        switch(dayOfWeekNumber) {
            case 0: 
                nameOfDay = 'Sunday';
                break;
            case 1:
                nameOfDay = 'Monday';
                break;
            case 2:
                nameOfDay = 'Tuesday';
                break;
            case 3:
                nameOfDay = 'Wednesday';
                break;
            case 4:
                nameOfDay = 'Thursday';
                break;
            case 5:
                nameOfDay = 'Friday';
                break;
            case 6:
                nameOfDay = 'Saturday';
                break;
        }
        
        let tid = d.toLocaleTimeString()
        tid = tid.slice(0, tid.length-3).replace(':', '');
        if (timer[nameOfDay] < 1) return;
        if (!timer[nameOfDay]) return;
        for (let i = 0; i < timer[nameOfDay].length; i++) {
            if (tid >= timer[nameOfDay][i].start && tid <= timer[nameOfDay][i].slutt) {
                channel.setName(`Skoletime: ${timer[nameOfDay][i].fag}`);
            } else if (tid >= timer[nameOfDay][i].slutt && tid <= timer[nameOfDay][i+1].start) {
                channel.setName(`Skoletime: Friminutt`);
            } else if (tid <= timer[nameOfDay][0].start) {
                channel.setName(`Skoletime: Fri`);
            }
        }
        
    }
}   