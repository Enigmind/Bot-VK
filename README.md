# Bot Anick
At the origin, Anick was a bot created for the squadron Veritas Kingdom on the game Elite:Dangerous.

## Invite Link :
https://discordapp.com/oauth2/authorize?client_id=622447626343677972&scope=bot&permissions=8

## Requirements :
- NodeJS 12.x mini
- Docker
## Setup dev environment :
- clone the git repository : `git clone https://github.com/Enigmind/Bot-VK.git`
- install dependances : `npm install`
- rename the file `config-example.json` to `config.json`
- enter your bot token in the `config.json` file and change the prefix if you want.
- launch bot in terminal : `node anick.js`
- write the help command in a discord channel : `§help`


## Prod :
- install docker (https://docs.docker.com/engine/install/)
- build the docker image : `docker build -t bot-anick .`

(if you wanna run the bot on a raspberry pi, change the base image in the dockerfile into `armv6/node:14-alpine`)

- run the container : `docker run -d bot-anick`