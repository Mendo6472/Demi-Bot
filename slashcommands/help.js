//Discord npm
const Discord = require("discord.js")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Obten ayuda sobre el bot"),
    //Sends an embed with the selected user avatar
    async run(client, interaction) {
        interaction.reply("aun no hago esta mondá")
    }
}