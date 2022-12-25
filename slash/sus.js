/*
 * Used to start a vote on muting a member of the vc
 *  USAGE: /sus @member
 */

const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("sus")
        .setDescription("Vote to mute the sussy baka")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("the sussy baka")
                .setRequired(true)),
	run: async ({ client, interaction }) => {
        /**
         * 1. Check that the user calling command is in the same VC as user being vote kicked
         * 2. Count number of users currently in that VC 
         * 3. Start the vote (using emoji replies)
         * 4. Hold vote for 5 minutes, if user gets 50% or more votes, mute user for 1 minute
         */

        const user = interaction.member;
        const target = interaction.options.getUser("target");

        // Check that user isn't trying to vote themselves
        if (user.id === target.id) 
            return interaction.editReply(`You can't vote yourself, you sussy baka`)

        // Check that the user is in VC
        if (!user.voice.channelId) 
            return interaction.editReply('Join a VC before trying to vote someone LMAO')

        // Check if user and target are in same VC
        if(!user.voice.channel.members.has(target.id)) 
            return interaction.editReply(`You can't just try to vote out ${target.username}#${target.discriminator}. They have to be in a channel with you!`)

        const channelSize = user.voice.channel.members.size;

	},
}
