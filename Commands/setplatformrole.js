const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command(["setplatformrole"], `Automatically give a role to users who record information for a platform`, true, false, false)
    .addDescription(`This command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role. Using the command without mentioning a role clears the set role for the platform.`)
    .addSection(`Set a platform role`, `\`@DirectoryBot setplatformrole (platform) (role)\``)
    .addSection(`Clear a platform role`, `\`@DirectoryBot setplatformrole (platform)\``);

command.execute = (receivedMessage, state, metrics) => {
    // Sets a role to automatically give to users who set information for the given platform
    if (state.messageArray.length > 0) {
        var platform = state.messageArray[0];
        var role = receivedMessage.mentions.roles.array()[0];

        if (state.cachedGuild.platformsList[platform]) {
            if (role) {
                state.cachedGuild.platformsList[platform].roleID = role.id;
                Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                    receivedMessage.guild.members.resolve(userID).addPlatformRoles(state.cachedGuild);
                })
                receivedMessage.channel.send(`Server members who set a ${platform} ${state.cachedGuild.platformsList[platform].term} will now automatically be given the role @${role.name}.`)
                    .catch(console.error);
            } else {
                if (state.cachedGuild.platformsList[platform].roleID) {
                    Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                        if (Object.keys(state.cachedGuild.userDictionary[userID]).includes(platform)) {
                            receivedMessage.guild.members.resolve(userID).roles.remove(state.cachedGuild.platformsList[platform].roleID);
                        }
                    })
                    state.cachedGuild.platformsList[platform].roleID = "";
                }
                receivedMessage.channel.send(`The ${platform} role in ${receivedMessage.guild} has been cleared.`)
                    .catch(console.error);
            }
            savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
        } else {
            // Error Message
            receivedMessage.author.send(`${receivedMessage.guild} doesn't have a platform named ${platform}.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform to set a role for.`)
            .catch(console.error);
    }
}

module.exports = command;
