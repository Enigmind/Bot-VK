// Need to work on it while Esca in production is sleeping
module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		console.log(`new member in VK. name is : ${member.user.username}`)
	},
};