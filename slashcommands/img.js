const Discord = require("discord.js")
const {Client} = require("google-img.js");
const img = require('googlethis');
require('dotenv').config();
const google = new Client(process.env.CSE_ID, process.env.API_KEY);

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("img")
    .setDescription("Obten resultados de imagenes basados en tu busqueda")
    .addStringOption(option =>  
        option.setName('busqueda')
        .setDescription('Texto a buscar en google images')
        .setRequired(true)),
    async run(client, interaction) {
        //Creating the buttons of the message
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('left')
                    .setLabel('◀️')
                    .setStyle(Discord.ButtonStyle.Primary),
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('right')
                    .setLabel('▶️')
                    .setStyle(Discord.ButtonStyle.Primary),
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close')
                    .setLabel('🇽')
                    .setStyle(Discord.ButtonStyle.Danger),
            );

        var currentImage = 0;
        var totalImages = 0;
        const filter = i => i.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        const searchquery = interaction.options.getString('busqueda');
        const imageEmbed = new Discord.EmbedBuilder()
            .setTitle(interaction.user.username)
            .setTimestamp();
        
        //Searching for the query with google images

        const result = await img.image(searchquery, { safe: true });
        collector.on('collect', async i => {
            if(i.user.id != interaction.user.id){
                i.deferUpdate();
                //TODO: Figure out how to do this
                return i.reply({content:"No puedes cambiar la imagen, solo la persona que usó el comando puede.", ephemeral: true});
            }
            switch(i.customId){
                case 'left':
                    if(currentImage == 0){
                        i.deferUpdate();
                        return interaction.followUp({content:"Ya estás en la primera imagen", ephemeral: true})
                    } 
                    currentImage--;
                    imageEmbed.setImage(result[currentImage]["url"])
                        .setFooter({text:(currentImage+1)+"/"+totalImages});
                    i.update({embeds: [imageEmbed], components: [row]})
                    break;
                
                case 'right':
                    if(currentImage >= totalImages){
                        i.deferUpdate();
                        return interaction.followUp({content:"Ya estás en la ultima imagen", ephemeral: true});
                    } 
                    currentImage++;
                    imageEmbed.setImage(result[currentImage]["url"])
                        .setFooter({text:(currentImage+1)+"/"+totalImages});
                    i.update({embeds: [imageEmbed], components:[row]})
                    break;

                case 'close':
                    await interaction.deleteReply();
                    break;
            }
        });

        collector.on('end', collected => interaction.editReply({embeds: [imageEmbed], components: []} ));

        totalImages = result.length
        if(result[0] == undefined) return interaction.reply({content: "No se han encontrado imagenes", ephemeral: true});
        //Sending the embed with the first image result
        imageEmbed.setImage(result[0]["url"])
            .setFooter({text:(currentImage+1)+"/"+totalImages});
        interaction.reply({embeds: [imageEmbed], components:[row]});
    }
}