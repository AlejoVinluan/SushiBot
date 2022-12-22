const { Events, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		async function handleCommand() {
            if (!interaction.isCommand()) return
            const client = interaction.client;
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd){
                interaction.reply(`${interaction.commandName} is not a valid slash command.`)
                return;
            }
            try{
                await interaction.deferReply()
                await slashcmd.run({ client, interaction })
            } catch (err) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
        handleCommand()
	},
};
