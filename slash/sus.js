/*
 * sus.js is used whenever a group vote is started to mute a member for 1 minute.
 *  USAGE: /sus @member
 */

const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("sus").setDescription("Mute the sussy baka"),
	run: async ({ client, interaction }) => {
		

        await interaction.editReply(``)
	},
}
