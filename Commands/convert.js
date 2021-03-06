const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories } = require('./../helpers.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');

var command = new Command("convert", false, false, true);
command.execute = (receivedMessage, state, locale) => {
	// Calculates the time for a user or time zone, given an inital time zone
	let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
	var timeText = "";
	var startTimezone = "";
	var resultTimezone;

	if (mentionedGuildMembers.length > 0) {
		var targetGuildMember = mentionedGuildMembers[0];
		if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes("timezone")) {
			if (directories[receivedMessage.guild.id].userDictionary[targetGuildMember.id] && directories[receivedMessage.guild.id].userDictionary[targetGuildMember.id].timezone && directories[receivedMessage.guild.id].userDictionary[targetGuildMember.id].timezone.value) {
				for (var i = 0; i < state.messageArray.length; i++) {
					if (state.messageArray[i] == getString(locale, command.module, "in")) {
						startTimezone = state.messageArray[i + 1]
						i++;
					} else if (state.messageArray[i] == getString(locale, command.module, "for")) {
						break;
					} else {
						timeText += state.messageArray[i] + " ";
					}
				}
				resultTimezone = directories[receivedMessage.guild.id].userDictionary[targetGuildMember.id].timezone.value;
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorUserZoneMissing").addVariables({
					"targetGuildMember": targetGuildMember
				})).catch(console.error);
				return;
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform").addVariables({
				"targetGuildMember": targetGuildMember,
				"server": receivedMessage.guild.toString()
			})).catch(console.error);
			return;
		}
	} else {
		for (var i = 0; i < state.messageArray.length; i++) {
			if (state.messageArray[i] == "in") {
				startTimezone = state.messageArray[i + 1]
				i++;
			} else if (state.messageArray[i] == "to") {
				resultTimezone = state.messageArray[i + 1];
				break;
			} else {
				timeText += state.messageArray[i] + " ";
			}
		}
	}

	if (startTimezone == "") {
		if (directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].timezone.value) {
			startTimezone = directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].timezone.value;
		} else {
			startTimezone = LocalZone.instance.name;
		}
	}

	if (IANAZone.isValidZone(startTimezone)) {
		if (resultTimezone) {
			if (IANAZone.isValidZone(resultTimezone)) {
				var inputTime = new chrono.parse(timeText);
				if (inputTime.length > 0) {
					inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
					var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date(), { zone: startTimezone });
					var convertedDateTime = dateTimeObject.setZone(resultTimezone);

					if (targetGuildMember) {
						receivedMessage.author.send(getString(locale, command.module, "successUser").addVariables({
							"originalTime": timeText,
							"originalTimeZone": startTimezone,
							"destinationTime": convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
							"targetGuildMember": targetGuildMember
						})).catch(console.error);
					} else {
						receivedMessage.author.send(getString(locale, command.module, "successZone").addVariables({
							"originalTime": timeText,
							"originalTimeZone": startTimezone,
							"destinationTime": convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
							"destinationTimeZone": resultTimezone
						})).catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, command.module, "errorBadTime"))
						.catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorBadResultZone"))
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoResultZone"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorBadStartZone"))
			.catch(console.error);
	}
}

module.exports = command;
