//Discord npm
const Discord = require("discord.js")
//color-thief-node npm, used to get most prominent color from an image
const { getColorFromURL } = require('color-thief-node');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Obten tu avatar o el de otro usuario")
    .addUserOption(option =>
        option
        .setName('usuario')
        .setDescription('Usuario para obtener el avatar')
        .setRequired(false)),
    //Sends an embed with the selected user avatar
    async run(client, interaction) {
        //Target will be the user inputed into the "usuario" option on the interaction
        var target = interaction.options.getUser('usuario');
        //If they didn't choose any user, the target will be the same user who used the interaction
        if(target == null) target = interaction.user;
        //Avatar to display in embed
        const avatar = target.displayAvatarURL({size: 2048});
        await interaction.reply("_ _") //This exists so discord stops screwing me up when it takes a long time to get the color from url
        try {
            //Dominant color on the target avatar
            const dominantColor = await getColorFromURL(target.displayAvatarURL({size: 1024, extension: "png"}));
            //Creating the embed
            const avatarEmbed = new Discord.EmbedBuilder()
            .setColor(dominantColor)//Color is the dominant color on the target avatar
            .setTitle(target.username+"#"+target.discriminator)
            .setImage(avatar)
            .setTimestamp();
            await interaction.editReply({embeds: [avatarEmbed]}) 
        } catch (error) {
            console.error(error)   
        }

	}
}