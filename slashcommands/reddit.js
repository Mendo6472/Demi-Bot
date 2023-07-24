const Discord = require("discord.js")
const justreddit = require("justreddit");

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Obten un post random de un subreddit")
    .addStringOption(option =>  
        option.setName('subreddit')
        .setDescription('Subreddit')
        .setRequired(true)),
    async run(client, interaction) {
        const subreddit = interaction.options.getString('subreddit');     
        const redditpost = await justreddit.randomPostFromSub({subReddit: subreddit}); // with a specified SubReddit
        if(redditpost["error"]){
            console.log(redditpost)
            return await interaction.reply("Ha ocurrido un error al buscar el subreddit")
        } 
        const embedreddit = new Discord.EmbedBuilder()
            .setColor('FFA500')
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()} )
            .setTitle(redditpost["title"])
            .setImage(redditpost["image"])
            .setTimestamp()
            .setFooter({text:"Post de: u/" + redditpost["author"] + " | " + "r/" + redditpost["subreddit"]})  
        await interaction.reply({embeds:[embedreddit]})
    }
}