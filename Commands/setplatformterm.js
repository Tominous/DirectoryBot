const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories, saveObject } = require('./../helpers.js');

var command = new Command("setplatformterm", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Changes the term used to refer to information for a given platform
	if (state.messageArray.length > 0) {
		let platform = state.messageArray[0].toLowerCase();
		if (directories[receivedMessage.guild.id].platformsList[platform]) {
			if (state.messageArray.length > 1) {
			let term = state.messageArray[1];

				directories[receivedMessage.guild.id].platformsList[platform].term = term;
				receivedMessage.author.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": term,
					"server": receivedMessage.guild.name
				})).catch(console.error);
				saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].platformsList, 'platformsList.txt');
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorNoTerm"))
				.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorBadPlatform").addVariables({
				"platform": platform,
				"server": receivedMessage.guild.name
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
