const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { MessageMentions } = require('discord.js');
const { saveObject, directories } = require('./../helpers.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ['import']
}

command.summary = {
	"en_US": "Copies your information from a source server to a destination server"
}

command.description = {
	"en_US": "This command copies your data for matching platforms from a given server."
}

command.sections = {
	"en_US": [
		new Section("Importing data", "`@DirectoryBot import (channel mention or snowflake from source server)`\
There are two ways to indicate which server to import from: by mentioning a channel from that server, or by providing the server's snowflake.\
\
To get a channel mention, start a message in the server you want to import from. Start with #, then autocomplete. You can then copy-paste the blue link into your command in the destination server.\
\
To get a server's snowflake, first activate Developer Mode in your User Settings. Then you can right-click on the source server and select \"Copy ID\" from the drop-down menu."),
	]
}

command.execute = (receivedMessage, state, metrics) => {
	// Copy information from the given guild to the current guild for any platforms with matching names
	let sourceGuildID;

	for (const argument of state.messageArray) {
		if (!isNaN(parseInt(argument))) {
			sourceGuildID = argument;
			break;
		} else if (argument.match(MessageMentions.CHANNELS_PATTERN)) {
			sourceGuildID = receivedMessage.mentions.channels.array()[0].guild.id;
			break;
		}
	}

	if (sourceGuildID) {
		if (sourceGuildID != receivedMessage.guild.id) {
			let sourceGuild = directories[sourceGuildID];
			if (sourceGuild) {
				let sourceDictionary = sourceGuild.userDictionary[receivedMessage.author.id];
				if (sourceDictionary) {
					let feedbackText = successHeader[locale];
					Object.keys(sourceDictionary).forEach(platform => {
						if (Object.keys(state.platformsList).includes(platform) && !state.userDictionary[receivedMessage.author.id][platform].value && sourceDictionary[platform] && sourceDictionary[platform].value) {
							state.userDictionary[receivedMessage.author.id][platform].value = sourceDictionary[platform].value;
							feedbackText += `\n${platform}: ${sourceDictionary[platform].value}`
						}
					})
					receivedMessage.member.addPlatformRoles(state);

					saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
					receivedMessage.author.send(feedbackText)
						.catch(console.error);
				} else {
					// Error Message
					receivedMessage.author.send(errorNoSourceData[locale])
						.catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(errorNoSourceBot[locale].addVariables({
					"botNickname": receivedMessage.client.user
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorSameGuild[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorBadSource[locale])
			.catch(console.error);
	}
}

let successHeader = {
	"en_US": "Your import succeeded. Here are the platforms that have been updated:"
}

let errorNoSourceData = {
	"en_US": "You do not seem to have any information recorded in the source server."
}

let errorNoSourceBot = {
	"en_US": "Source server for import does not seem to be running ${botNickname}."
}

let errorSameGuild = {
	"en_US": "Source server for import cannot be the same as the destination server."
}

let errorBadSource = {
	"en_US": `Source server for import could not be parsed.`
}

module.exports = command;
