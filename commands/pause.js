const { prefix, token } = require("../config.json");
const Voice = require("@discordjs/voice");

module.exports = {
  name: "pause",

  run(message, serverQueue, queue, client) {
    // error checking
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to pause the music!"
      );

    if (!serverQueue)
      return message.channel.send("Listen here you little shit");

    if (serverQueue.playing != true)
      return message.channel.send(`To unpause, send \`${prefix}play\``);
    // ---

    // pause it
    serverQueue.subscription.player.pause()
    serverQueue.playing = false;
    return message.channel.send(
      `Music paused. To unpause, send \`${prefix}play\``
    );
  },
};
