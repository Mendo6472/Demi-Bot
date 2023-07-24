const Discord = require("discord.js")
const OS = require("os");
const moment = require("moment");
require("moment-duration-format")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Obten el tiempo que el bot ha estado encendido"),
    async run(client, interaction) {
        const actividad = moment.duration(client.uptime).format(" D [Dias], H [Horas], m [Minutos], s [Segundos]");
        const embeduptime = new Discord.EmbedBuilder()
        .setColor('0000FF')
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()} )
        .setTitle("Demi!Bot Uptime")
        .setThumbnail('https://cdn.discordapp.com/attachments/659986745156304906/800870900895449118/emote.png')
        .addFields(
            { name: '*Tiempo que Demi!Bot a estado activo:*', value: '_ _', inline: false },
        )
        .addFields(
            { name: actividad, value: '_ _', inline: false },
        )
        .setTimestamp()
        interaction.reply({embeds:[embeduptime]})
    }
}