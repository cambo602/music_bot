# White People Bangers
 
It's a bot that plays ~~music~~ white people bangers. Uses `discord.js`, `discord.js/voice`, `ytdl`, and `FFmpeg`

# Issues

There is a couple huge issues with the libraies being used
- `discord.js` v13.2.0 (latest version) **NEEDS** node v16 to function (Because of [this](https://stackoverflow.com/questions/68693319/why-am-i-getting-a-referenceerror-abortcontroller-is-not-defined-in-discord-js) and *another* node library)
- `ytdl` v1.4.1 (latest version) "works" with node v16 but has random [dropouts](https://github.com/fent/node-ytdl-core/issues/902), so you should use node v14 or lower

### How do we get around these issues?

Well basicaly we just use the newest version of `discord.js` that works with node v14

1. `discord.js` v**13.1.0** works with node v14, however it needs the [AbortControler](https://stackoverflow.com/questions/68693319/why-am-i-getting-a-referenceerror-abortcontroller-is-not-defined-in-discord-js) node library (which only gets added in node v16), so [node-abort-controller](https://www.npmjs.com/package/node-abort-controller) is used, and in the `musicbot.congif.js` file we define node-abort-controller as a global AbortControler and `discord.js` *dosen't know the diffrence*
2. Because we are using not the latest version of node (I'm using `v14.17.6`), I'd suggest using [nvm4w](https://github.com/coreybutler/nvm-windows) (Node Version Manager 4 Windows) to manage which version you are running. Also note: if you use nvm, the `nvm use [node version]` command has to be run in a command prompt with admin privileges

# Getting started

Clone the repo and navigate to it, initliaze it then install the dependencies

    npm init -y
    npm install

The bots token and prefix are stored in a file called `config.js` located in main folder. Make it, and fill it with this:

    {
        "token": "YOUR_TOKEN_HERE",
        "prefix": "YOUR_PREFIX_HERE"
    }

And then fill in the values for your bot's prefix and the [bots token](https://discord.com/developers/applications)

Run the bot with this command (in the bots directiory):

    node musicbot.congif.js

# Changes
## Change Notes from cambo602 repo:
- Updated Node and discord.js
- discord.js now has a seprate voice module (@discord.js/voice)
- added file/command modularity (because of this some new stuff gets handled in index.js)
- I removed the connection property from the queueContruct because it doesn't make sense with the new @discord.js/voice
- ok I added a player property to the queueContruct I swear they are diffrent

## Version changes 
v1.2.0 - Reverted to node v14 for real this time. There is now a new entry point: `musicbot.congif.js`.
v1.0.2 - bot functions
v1.0.1 - bot is not functioning