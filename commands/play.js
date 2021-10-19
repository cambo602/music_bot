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
    const recource = Voice.createAudioResource(ytdl(song.url), {
      inputType: Voice.StreamType.Arbitrary,
    })

		connection.subscribe(player)

		player.play(recource)
		player.on(Voice.AudioPlayerStatus.Idle, () => {
			serverQueue.songs.shift();
			client.commands.get("play").execute(voiceChannel.guild, queueContruct.songs[0], queue, client)
		})

    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  },
};
