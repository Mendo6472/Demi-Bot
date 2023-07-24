const axios = require('axios');
const Discord = require("discord.js")
require('dotenv').config();

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("clima")
    .setDescription("Obten resultados del clima basados en tu busqueda")
    .addStringOption(option =>  
        option.setName('ubicacion')
        .setDescription('Nombre de la ciudad a buscar el clima')
        .setRequired(true)),
    async run(client, interaction){
        const searchquery = interaction.options.getString('ubicacion');
        const options = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/current.json',
            params: {q: searchquery, lang: 'es'},
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
          };

          try {
            const response = await axios.request(options);
            const result = response.data
            if (result && result && result.current) {
                // Current
              const temp = result.current.temp_c;
              const feelsLike = result.current.feelslike_c;
              const clouds = result.current.cloud;
              const humidity = result.current.humidity;
              const wind = result.current.wind_kph;
              const lastUpdated = result.current.last_updated;
              const condition = result.current.condition.text
    
              // Location
              const location = result.location.name + ", " + result.location.country;
              const latitude = result.location.lat
              const longitude = result.location.lon
              
              const weatherEmbed = new Discord.EmbedBuilder()
    
                .setColor('b7ce14')
                .setTitle(location)
                .setThumbnail(result.current.imageUrl)
                .addFields(
                  { name: '▸ ☁ __Estado actual__', value: `>>> **Condición:** ${condition}\n**Cielo:** ${clouds}%\n**Temperatura:** ${temp} °C\n**Sensación térmica:** ${feelsLike} °C\n**Humedad:** ${humidity}%\n**Viento:** ${wind} kmph` },
                  { name: '▸ 🔭 __Actualización__', value: `>>> **Fecha:** ${lastUpdated}` },
                  { name: '▸📄 __Información__', value: `>>> **Ubicacion:** ${location}\n**Latitud:** ${latitude}\n**Longitud:** ${longitude}` }
                )
                .setTimestamp()
                .setFooter({ text: 'Weather API', iconURL: 'https://cdn.discordapp.com/attachments/782306417998561320/1132133120909508669/weatherAPI.png' });
              interaction.reply({ embeds: [weatherEmbed] });
            } else {
              interaction.reply({ content: '⚠️ | No pude encontrar la ubicacion que me distes.' })
            }
          } catch (error) {
            console.error(error);
            interaction.reply({ content: '⚠️ | Error al obtener el clima, intenta probar de vuelta.' })
          }
    }
}

