const { Discord, Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const { Player } = require("discord-player");

dotenv.config();

// TOKEN - Used to access actual Bot
const TOKEN = process.env.TOKEN;

// CLIENT_ID - Represents the Bot Client
const CLIENT_ID = process.env.CLIENT_ID;

// GUILD_ID - Represents the server the Bot will join
const GUILD_ID = process.env.GUILD_ID;

// botLoaded - Uses to determine whether or not bot is loaded
const botLoaded = process.argv[2] == "load";

// With the Discord client, need to take into account the server
//  and the voice states within the server
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.slashcommands = new Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

console.log("Loading slash files.")
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (botLoaded) commands.push(slashcmd.data.toJSON())
}
console.log("Slash files loaded.\n")



if (botLoaded) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        console.log("Error deploying slash commands." + err)
    })
} else {
    console.log("Attempting to add events.")
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
    console.log("Events loaded\n")
    client.login(TOKEN)
}
