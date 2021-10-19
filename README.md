# music_bot
 
It's a bot that plays music. Uses `discord.js`, `discord.js/voice`, `ytdl`, and `FFmpeg`

## Change Notes:
- Updated Node and discord.js
- discord.js now has a seprate voice module (@discord.js/voice)
- added file/command modularity (because of this some new stuff gets handled in index.js)
- I removed the connection property from the queueContruct because it doesn't make sense with the new @discord.js/voice
- ok I added a player property I swear they are diffrent