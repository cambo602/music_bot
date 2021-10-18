const Discord = require("../node_modules/discord.js");
const ytdl = require("../node_modules/ytdl-core");

module.exports = {
  name: "execute",

  async execute(message, serverQueue, queue){
    const args = message.content.split(" ");
    
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return ["Resopnd", "Get in a voice channel you bitch"];

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send( "I need the permissions to join and speak in your voice channel!" );

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    console.log(song.url)

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send("No");
      }
    } 
    else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }    
  }
}