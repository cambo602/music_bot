const Discord = require("../node_modules/discord.js");
const Voice = require("@discordjs/voice");
const ytdl = require("../node_modules/ytdl-core");
const { NONAME } = require("dns");

module.exports = {
  name: "execute",

  async execute(message, serverQueue, queue, client) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send("Get in a voice channel you bitch");

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );

    // resume the music if the play command has been called to unpause
    if (serverQueue && serverQueue.playing == false) {
      serverQueue.playing = true;
      serverQueue.player.unpause();
      return message.channel.send("Music resumed");
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
        songs: [],
        player: null,
        //volume is never used
        volume: 5,
        playing: true,
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      // try {
      // make connection
      const connection = Voice.joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      // play the song
      client.commands
        .get("play")
        .execute(voiceChannel.guild, queueContruct.songs[0], queue, client);
      // } catch (err) {
      //   console.log(err);
      //   queue.delete(message.guild.id);
      //   return message.channel.send("Error playing song");
      // }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  },
};
