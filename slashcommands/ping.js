const Discord = require("discord.js")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Obten el ping (latencia) del bot"),
    //Sends an empty message and then edits that message with the time it took to send the message in ms
    //and the Discord API ping
    async run(client, interaction) {
        //starts counting the time
        const start = Date.now();
        interaction.reply({content :"_ _"}).then(m =>{
        const { EmbedBuilder } = require('discord.js');
        //stops counting time when the message was sent
        const end = Date.now();
        const pingEmbed = new EmbedBuilder()
    	    .setColor("9663a4")
	        .setAuthor({ name:interaction.user.username, iconURL: interaction.user.displayAvatarURL({size: 2048}) })
	        .addFields(
            //(end-start) is the time in ms it took to send the message
        	{ name: 'Ping:', value: `\`${end - start} ms\`` },
            { name: 'Discord API ping:', value: `\`${client.ws.ping}ms\``},
	        )
	        .setTimestamp()
        //edit the message to have the embed with the pings
        m.edit({embeds:[pingEmbed]})
        })
	}
}