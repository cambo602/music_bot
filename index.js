const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const fs = require("fs");

// Discord Has an new thing with intents, Not really sire how it works,
// but if you're unable to get information its probaly because when the
// client is made it does not say it wants that informantion
const neededIntents = new Discord.Intents().add(
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
);
const client = new Discord.Client({ intents: neededIntents });

// Init the queue
const queue = new Map();

// |  This is a multifile command handler. We will be able to call a file by 
// |  name and run it from anywhere
// |
// |  Discord.Collection() is basicaly just a cooller dict, and attaching it
// |  to client with our new object "commands" lets us access it from anywhere
// \/ in the music_bot folder.
client.commands = new Discord.Collection();

const commandFileNames = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

// adds the commands to the collection
for (const file of commandFileNames) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}
// ---

// Debug stuff
client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});
// ---

//Decides where all the messages will go, depending on the command
client.on("message", async (message) => {
  // error checking
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  // ---

  // grabs the queue for the sever that the message was sent in (if theres none
  // the code will deal with that in execute.js)
  const serverQueue = queue.get(message.guild.id);

  // parse the message
  const m = message.content.split(" ")[0].toLowerCase().replace(prefix, "");

  // convert the bot commands to the file name that we want to run
  const alisis = {
    play: "execute",
    p: "execute",
    skip: "skip",
    s: "skip",
    fs: "skip",
    pause: "pause",
    queue: "display-queue",
    q: "display-queue",
  };

  // does the command exsist?
  if (!alisis[m])
    return message.channel.send("You need to enter a valid command!");

  // THIS IS WHERE THE MAGIC HAPPENS
  // we grab from our list of commands the file with the same name as whatever
  // the alisis dict tells us, and then runs the function "run" in the file
  await client.commands
    .get(alisis[m])
    .run(message, serverQueue, queue, client);
});

client.login(token);
