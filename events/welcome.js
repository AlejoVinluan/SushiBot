const { AttachmentBuilder, Events } = require('discord.js');
const Canvas = require("canvas")
const dotenv = require("dotenv");
const backgroundURL = "https://i.imgur.com/zvWTUVu.jpg"

dotenv.config()

const welcomeChannel = process.env.WELCOME_ID

const dim = {
    height: 675,
    width: 1200,
    margin: 50
}

const av = {
    size: 256,
    x: 480,
    y: 170
}

const generateWelcome = async (member) => {
    let username = member.user.username
    let discrim = member.user.discriminator
    let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: false, size: av.size})
    const pngAvatar = avatarURL.replaceAll('.webp', '.png')
    console.log(pngAvatar)
    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")

    console.log("Generating background image.")
    const backgroundImage = await Canvas.loadImage(backgroundURL)
    ctx.drawImage(backgroundImage, 0, 0)
    console.log("Background image successfully generated.\n")

    ctx.fillStyle = "rgba(0,0,0,0.8)"
    ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)


    const avatarImage = await Canvas.loadImage(pngAvatar)
    ctx.save()

    ctx.beginPath()
    ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avatarImage, av.x, av.y)
    ctx.restore()

    // write in text
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    // draw in Welcome
    ctx.font = "50px Sans Not-Rotated"
    ctx.fillText("Welcome", dim.width/2, dim.margin + 70)

    // draw in the username
    ctx.font = "60px Sans Not-Rotated"
    ctx.fillText(username + "#" + discrim, dim.width/2, dim.height - dim.margin - 125)

    // draw in to the server
    ctx.font = "50px Sans Not-Rotated"
    ctx.fillText("to the server", dim.width / 2, dim.height - dim.margin - 50)

    const attachment = new AttachmentBuilder(canvas.toBuffer())
    return attachment;
}

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
		const img = await generateWelcome(member)
        member.guild.channels.cache.get(welcomeChannel).send({
            content: `<@${member.id}> Welcome to the server!`,
            files: [img]
        })
	},
};
