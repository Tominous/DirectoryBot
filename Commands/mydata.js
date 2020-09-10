const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { footerText } = require('./../localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ['mydata', 'myentries']
}

command.summary = {
	"en_US": "Lists all your platform entries"
}

command.description = {
	"en_US": "This command sends you a private message with all the information you've recorded."
}

command.sections = {
	"en_US": [
		new Section("Usage", "`@DirectoryBot mydata`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Sends the user all the information they've input into the bot
	let embed = new MessageEmbed().setColor('6b81eb')
		.setAuthor(receivedMessage.guild.name, receivedMessage.guild.iconURL())
		.setTitle(yourData[locale])
		.setFooter(footerText[locale], `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
		.setTimestamp();
	let text = '';
	let dictionary = state.userDictionary[receivedMessage.author.id];
	Object.keys(dictionary).forEach(platform => {
		if (dictionary[platform].value) {
			text += '\n' + platform + ': ' + dictionary[platform].value;
		}
	})
	let observers = [];
	let dreamers = [];
	let explorers = ['103335856479162368'];
	let cartographers = ['115221369339379720'];
	let archivists = []
	let grandArchivists = ['106122478715150336', '112785244733628416'];

	if (observers.includes(receivedMessage.author.id)) { // Observer
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114192013000816/IH_PatreonTierImages_Observer.jpg');
	} else if (dreamers.includes(receivedMessage.author.id)) { // Dreamer
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114186811932713/IH_PatreonTierImages_Dreamer.jpg');
	} else if (explorers.includes(receivedMessage.author.id)) { // Explorer
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114188095651840/IH_PatreonTierImages_Explorer.jpg');
	} else if (cartographers.includes(receivedMessage.author.id)) { // Cartographer
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114184685420615/IH_PatreonTierImages_Cartographer_.jpg');
	} else if (archivists.includes(receivedMessage.author.id)) { // Archivist
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114183620067358/IH_PatreonTierImages_Archivist.jpg');
	} else if (grandArchivists.includes(receivedMessage.author.id)) { // Grand Archivist
		embed.setImage('https://cdn.discordapp.com/attachments/545684759276421120/734114189710327818/IH_PatreonTierImages_Grand_Archivist.jpg');
	}

	if (text.length < 2049) {
		embed.setDescription(text);
		receivedMessage.author.send(embed)
			.catch(console.error);
	} else {
		// Error Message
		receivedMessage.author.send(errorMessageOverflow[locale].addVariables({
			"alias": state.command
		})).catch(console.error);
	}
}

let yourData = {
	"en_US": "Your Data"
}

let errorMessageOverflow = {
	"en_US": "Your `${alias}` message is too long to fit in a single Discord message. Please try the `lookup` command instead."
}

module.exports = command;
