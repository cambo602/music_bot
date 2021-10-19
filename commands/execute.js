const Discord = require("../node_modules/discord.js");
const Voice = require("@discordjs/voice");
const ytdl = require("../node_modules/ytdl-core");
const { NONAME } = require("dns");

module.exports = {
  name: "execute",

  async run(message, serverQueue, queue, client) {
    const args = message.content.split(" ");

    // error checking
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send("Get in a voice channel you bitch");

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    // ---

    // resume the music if the play command has been called to unpause
    if (serverQueue && serverQueue.playing == false) {
      serverQueue.playing = true;
      serverQueue.subscription.player.unpause();
      return message.react("👍");
    }

    // try url, then get url
    if (!ytdl.validateURL(args[1]))
      return message.channel.send("You need to enter a valid url");

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url, 
      // dosent work
      image: songInfo.thumbnail_url,
      // ---
      person: message.author
    };
    // ---

    if (!serverQueue) {
      // make the queue for this sever
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        songs: [],
        subscription: null,
        // volume is never used
        volume: 5,
        playing: true,
      };

      // add it to the big queue object that the bot has
      queue.set(message.guild.id, queueContruct);
      // add the song
      queueContruct.songs.push(song);

      try {
        // make connection
        const connection = Voice.joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        // play the song
        client.commands
          .get("play")
          .run(voiceChannel.guild, queueContruct.songs[0], queue, client);
      } catch (err) {
        // big fuck
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send("Error playing song");
      }
    } else {
      // add the song to the queue
      serverQueue.songs.push(song);
      return message.channel.send(
        `**${song.title}** has been added to the queue!`
      );
    }
  },
};
