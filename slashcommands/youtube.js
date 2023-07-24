const Discord = require("discord.js")
var search = require('youtube-search');
require('dotenv').config();
var opts = {
    maxResults: 20,
    key: process.env.YOUTUBE_KEY
  };

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Obten un resultado de un video de youtube basado en tu busqueda")
    .addStringOption(option =>  
        option.setName('video')
        .setDescription('video a buscar en youtube')
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
                    .setCustomId('switcher')
                    .setLabel("Link/Embed")
                    .setStyle(Discord.ButtonStyle.Secondary)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close')
                    .setLabel('🇽')
                    .setStyle(Discord.ButtonStyle.Danger),
            );
    
        var currentImage = 0;
        var totalImages = 0;
        var isEmbed = true;
        const filter = i => i.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        const searchquery = interaction.options.getString('video');
        const youtubeEmbed = new Discord.EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()} )
            .setColor("ff0004")
            .setTimestamp();
        search(searchquery, opts, function(err, results) {
            collector.on('end', collected => interaction.editReply({embeds: [youtubeEmbed], components: []} ));
            //Event that happens when one of three buttons are clicked
            collector.on('collect', async i => {
                if(i.user.id != interaction.user.id){
                    i.deferUpdate();
                    //TODO: Figure out how to do this
                    return i.reply({content:"No puedes cambiar la imagen, solo la persona que usó el comando puede.", ephemeral: true})
                }
                switch(i.customId){
                    case 'left':
                        if(currentImage == 0){
                            i.deferUpdate();
                            
                            return interaction.followUp({content:"Ya estás en la primera imagen", ephemeral: true})
                        } 
                        currentImage--;
                        youtubeEmbed.setImage(results[currentImage]["thumbnails"]["high"]["url"])
                            .setTitle(results[currentImage]["title"])
                            .setURL(results[currentImage]["link"])
                            .setDescription((results[currentImage]["description"] == "")?" ":results[0]["description"])
                            .setFooter({text:(currentImage+1)+"/"+totalImages});
                        if(isEmbed)i.update({content:"", embeds: [youtubeEmbed], components:[row]})
                        else i.update({content:results[currentImage]["link"], embeds:[], components:[row]})
                        break;
                    
                    case 'right':
                        if(currentImage >= totalImages){
                            i.deferUpdate();
                            return interaction.followUp({content:"Ya estás en la ultima imagen", ephemeral: true});
                        } 
                        currentImage++;
                        youtubeEmbed.setImage(results[currentImage]["thumbnails"]["high"]["url"])
                            .setTitle(results[currentImage]["title"])
                            .setURL(results[currentImage]["link"])
                            .setDescription((results[currentImage]["description"] == "")?" ":results[0]["description"])
                            .setFooter({text:(currentImage+1)+"/"+totalImages});
                        if(isEmbed)i.update({contents:"", embeds: [youtubeEmbed], components:[row]})
                        else i.update({content:results[currentImage]["link"], embeds:[], components:[row]})
                        break;

                    case 'switcher':
                        if(isEmbed){
                            i.update({content: results[currentImage]["link"], embeds:[], components:[row]})
                            isEmbed = false;
                            return;
                        }
                        i.update({content:"", embeds:[youtubeEmbed], components:[row]})
                        isEmbed = true;
                        break;

                    case 'close':
                        await interaction.deleteReply();
                        break;
                }
            });
            if(err) return console.log(err);
            totalImages = results.length;
            youtubeEmbed.setImage(results[0]["thumbnails"]["high"]["url"])
                .setTitle(results[0]["title"])
                .setURL(results[0]["link"])
                .setDescription((results[0]["description"] == "")?" ":results[0]["description"])
                .setFooter({text:(currentImage+1)+"/"+totalImages});
            interaction.reply({embeds: [youtubeEmbed], components:[row]})
          });
    }
}