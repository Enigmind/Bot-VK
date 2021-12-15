// Need to work on it while Esca in production is sleeping
module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		client.channels.cache.get('526808996330602506').send(`**${member.user.username}** s'est envolé vers de nouveaux horizons. Bon vol commandant ! o7`);
		console.log(`member in VK quit. name was : ${member.user.username}`)
	},
};