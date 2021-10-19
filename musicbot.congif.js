// ok so this file basicaly makes sure that discord.js will see the AbortController
// yes i stole this idea

const bot = require("./index.js")

global.AbortController = require("node-abort-controller").AbortController;