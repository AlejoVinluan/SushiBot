/*
 * Used to start a vote on muting a member of the vc
 *  USAGE: /sus @member
 */

const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("sus").setDescription("Vote to mute the sussy baka")
        .addUserOption(option => 
            option.setName("the sussy baka")
                .setDescription("Who to start a vote mute on")
                .setRequired(true)),
	run: async ({ client, interaction }) => {
        /**
         * 1. Check that the user calling command is in the same VC as user being vote kicked
         * 2. Count number of users currently in that VC 
         * 3. Start the vote (using emoji replies)
         * 4. Hold vote for 5 minutes, if user gets 50% or more votes, mute user for 1 minute
         */

        const user = interaction.member;
        const target = interaction.options.getUser("the sussy baka");

        if (user === target) return interaction.reply({ content: `You can't vote yourself, you sussy baka`, ephemeral: true})

        // Check that the user is in VC
        if (!user.voice.channel) return interaction.reply({ content: 'Must be in a VC to vote mute someone', ephemeral: true })

        // Check that the user is in the same VC as the target
        if(user.voice.channel !== target.voice.channel) return interaction.reply({ content: 'Target must be in a VC with you to vote mute', ephemeral: true })
        
        

        await interaction.reply(``)
	},
}
