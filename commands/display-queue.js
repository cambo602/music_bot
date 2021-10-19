const Discord = require("discord.js");

module.exports = {
  name: "display-queue",

  run(message, serverQueue, queue, client) {
    // error checking
    if (!serverQueue)
      return message.channel.send("There are no song in the queue!");
    // ---

    // make an embed
    const queueEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Queue");

    // add the songs to the embed
    for (var i = 0; i < serverQueue.songs.length && i < 10; i++) {
      queueEmbed.addField(
        `${i + 1}. ${serverQueue.songs[i].title}`,
        `Added by ${serverQueue.person.username}`,
        false
      );
    }

    // send the embed
    return message.channel.send({ embeds: [queueEmbed] });
  },
};
