const Discord = require("../node_modules/discord.js");
const Voice = require("@discordjs/voice");
const ytdl = require("../node_modules/ytdl-core");

module.exports = {
  name: "play",

  execute(guild, song, queue, client) {
    const serverQueue = queue.get(guild.id);
		const connection = Voice.getVoiceConnection(guild.id);

    if (!song) {
      connection.destory();
      queue.delete(guild.id);
      return;
    }

		const player = Voice.createAudioPlayer();

		connection.subscribe(player)

		player.play(ytdl(song.url))
		player.on(Voice.AudioPlayerStatus.Idle, () => {
			serverQueue.songs.shift();
			client.commands.get("play").execute(voiceChannel.guild, queueContruct.songs[0], queue, client)
		})

    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  },
};
