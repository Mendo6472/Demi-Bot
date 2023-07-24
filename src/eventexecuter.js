//Discord npm
const Discord = require("discord.js")
//Load files
const fs = require("fs")
//Function to handle discord client events
function Eventexecuter(client){
    //Event when the client "turns on"
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        //TODO: Add status to bot
    });
    //Event to execute when the discord client receives a message
    client.on('messageCreate', (message) => {
        const prefix = "e!"
        console.log(message.content);
        //TODO: load commands, not slash commands, and make code to execute them
    });
    //Event to execute when a slash command is used
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand) return;
        const slashComs = client.slashcommands.get(interaction.commandName);
        if (!slashComs) return;
        try {
            await slashComs.run(client, interaction);
        } catch (e) {
            console.log(e);
        }
    });
    //Event to execute when the discord client faces an error
    client.on('error',(error) =>{
        console.log(error);
    });
}
//Exporting the Eventexecuter funtion
module.exports = {
    Eventexecuter,
}