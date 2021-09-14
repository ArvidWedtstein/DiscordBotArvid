const client = require('../main')

client.on('interaction', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.defer().catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({ content: 'An error has occured'});

        const args = []
        interaction.options.array().map((x) => {
            args.push(x.value);
        });

        cmd.run(client, interaction, args);
    }
    if (interaction.isContextMenu()) {
        let slashCmds = client.slashCmds.get(interaction.commandName)
        if (slashCmds) slashCmds.run(interaction)
    }
});