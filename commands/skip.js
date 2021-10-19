module.exports = {
  name: "skip",

  execute(message, serverQueue, queue, client) {
    if (!message.member.voice.channel) return message.channel.send( "You have to be in a voice channel to stop the music!" );

    if (!serverQueue) return message.channel.send("There is no song that I could skip!");

    serverQueue.songs.shift();
    serverQueue.player.stop();
    client.commands.get("play").execute(message.guild, serverQueue.songs[0], queue, client)
  }
};