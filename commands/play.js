const Voice = require("@discordjs/voice");
const ytdl = require("../node_modules/ytdl-core");

module.exports = {
  name: "play",

  run(guild, song, queue, client) {
    console.log("Play");

    // get some info
    const serverQueue = queue.get(guild.id);
    const connection = Voice.getVoiceConnection(guild.id);

    // The only point where we would be here and have no song is if there is nothing left
    // queue, so we delete the queue and connection
    if (!song) {
      connection.destroy();
      queue.delete(guild.id);
      return;
    }

    // We create the audio player, shove the song in the audio player, and then shove
    // the adtio player in the voice channel
    const player = Voice.createAudioPlayer();
    const recource = Voice.createAudioResource(ytdl(song.url), {
      inputType: Voice.StreamType.Arbitrary,
    });

    serverQueue.subscription = connection.subscribe(player);
    // ---

    // wonder what this does
    try {
      player.play(recource);
    } catch {
      return serverQueue.textChannel.send(`Failed to play: **${song.title}**`);
    }

    // track player state
    player.on("stateChange", (oldState, newState) => {
      console.log(`Went from ${oldState.status} to ${newState.status}`);

      // if player stops (goes from playing to idle)
      if (
        oldState.status == Voice.AudioPlayerStatus.Playing &&
        newState.status == Voice.AudioPlayerStatus.Idle
      ) {
        // The song is done, move on 
        serverQueue.songs.shift();

        client.commands
          .get("play")
          .run(guild, serverQueue.songs[0], queue, client);

        console.log("Playing has stopped");
        player.stop();
      }

      // if player breaks (goes from buffering to idle)
      if (
        oldState.status == Voice.AudioPlayerStatus.Buffering &&
        newState.status == Voice.AudioPlayerStatus.Idle
      ) {
        // oh wow this is all the same, I really dont need a whole other if statment
        // huh
        serverQueue.songs.shift();

        client.commands
          .get("play")
          .run(guild, serverQueue.songs[0], queue, client);

        console.log("Playing failed");
        player.stop();
      }
    });

    // all has gone well?
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  },
};
