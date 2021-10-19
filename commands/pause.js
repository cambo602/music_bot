const { prefix, token } = require("../config.json");

module.exports = {
    name: "pause",
  
    execute(message, serverQueue, queue, client) {
      console.log("Pause")
      if (!message.member.voice.channel) return message.channel.send( "You have to be in a voice channel to pause the music!" );
  
      if (!serverQueue) return message.channel.send("Listen here you little shit");

      if (serverQueue.playing == true) return message.channel.send(`To unpause, send \`${prefix}play\``);
  
      serverQueue.playing = false
      console.log(`paused? ${serverQueue.player.pause()}`);
      return message.channel.send(`Music paused. To unpause, send \`${prefix}play\``)
    }
  };