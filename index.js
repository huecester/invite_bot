// Packages
const { Client, Intents } = require('discord.js');

// Init
require('dotenv').config();


// Create client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES
	]
});

// Setup event listeners
client.once('ready', () => {
	console.log('Bot online.');
});

client.on('guildMemberRemove', async member => {
	if (member.user.bot) { return; }

	try {
		const guild = member.guild;
		const cache = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
		console.log(`${member.user.username} left ${guild.name}.`)
		let invite = null;
		while (!invite) {
			try {
				const random = cache.random();
				const test = await guild.invites.create(random.id);
				invite = test.url;
			} catch (err) {
				console.error(err);
			}
		}
		console.log(`Inviting ${member.user.username} to ${guild.name}.`);
		if (member.user.dmChannel) {
			member.user.dmChannel.send(invite);
		} else {
			await member.user.createDM();
			member.user.dmChannel.send(invite);
		}
	} catch (err) {
		console.error(err);
	}
});


// Login
client.login(process.env.DISCORD_BOT_TOKEN);
