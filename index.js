const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { debug } = require("console");
const { args } = require("commander");

// Discord Has an new thing with intents, Not really sire how it works,
// but if you're unable to get information its probaly because when the
// client is made it does not say it wants that informantion
const neededIntents = new Discord.Intents().add(
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_MESSAGES
);
const client = new Discord.Client({ intents: neededIntents });

// Init the queue
const queue = new Map();

// Making a multifile command handler.
// Discord.Collection() is basicaly just a cooller map, and attaching it
// to client with our new object commands lets us access it from anywhere
// in the music_bot folder.
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
  // console.log(message);

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  const m = message.content.split(" ")[0].toLowerCase().replace(prefix, "");

  console.log(`pause? ${m == "pause"}`)

  if ("play" == m || "p" == m)
    await client.commands
      .get("execute")
      .execute(message, serverQueue, queue, client);
  else if (m =="skip")
    await client.commands
      .get("skip")
      .execute(message, serverQueue, queue, client);
  else if (m == "pause")
    await client.commands
      .get("pause")
      .execute(message, serverQueue, queue, client);
  else if (m == "queue") display(message, serverQueue);
  else message.channel.send("You need to enter a valid command!");
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };
  console.log(song.url);

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );

  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function display(message, serverQueue) {
  if (!serverQueue) {
    return message.channel.send("There are no song in the queue!");
  } else {
    message.channel.send("Current queue:");
    message.channel.send("1");
    for (i = 0; i < 2; i++) {
      message.channel.send(i);
      message.channel.send(queueContruct.songs[0]);
    }
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);
