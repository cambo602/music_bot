const Discord = require("../node_modules/discord.js");
const Voice = require("@discordjs/voice");

module.exports = {
  name: "play",

  execute(guild, song, queue, client) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      getVoiceConnection(guild.id).destory();
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
  },
};
