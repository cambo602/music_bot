const Discord = require("../node_modules/discord.js");
const Voice = require("@discordjs/voice");
const ytdl = require("../node_modules/ytdl-core");

module.exports = {
  name: "play",

  execute(guild, song, queue, client) {
    console.log("Play");

    const serverQueue = queue.get(guild.id);
    const connection = Voice.getVoiceConnection(guild.id);

    if (!song) {
      connection.destroy();
      queue.delete(guild.id);
      return;
    }

    const player = Voice.createAudioPlayer();
    serverQueue.player = player;
    const recource = Voice.createAudioResource(ytdl(song.url), {
      inputType: Voice.StreamType.Arbitrary,
    });

    connection.subscribe(player);

    // wonder what this does
    player.play(recource);

    // track player state
    player.on("stateChange", (oldState, newState) => {

      console.log(`Went from ${oldState.status} to ${newState.status}`)
      // if player stops (goes from playing to idle)
      if (
        oldState.status == Voice.AudioPlayerStatus.Playing &&
        newState.status == Voice.AudioPlayerStatus.Idle
      ) {
        serverQueue.songs.shift();

        client.commands
          .get("play")
          .execute(guild, serverQueue.songs[0], queue, client);

        console.log("Playing has stopped");
        player.stop();
      }

      // if player breaks (goes from buffering to idle)
      if (
        oldState.status == Voice.AudioPlayerStatus.Buffering &&
        newState.status == Voice.AudioPlayerStatus.Idle
      ) {
        serverQueue.songs.shift();

        client.commands
          .get("play")
          .execute(guild, serverQueue.songs[0], queue, client);

        console.log("Playing failed");
        player.stop();
      }
    });

    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  },
};
