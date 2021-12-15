module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// client.channels.cache.get('743410236689350676').send('message');
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
		// activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
		client.user.setActivity("Le Cosmos", {
			type: "LISTENING"
		  })
	},
};