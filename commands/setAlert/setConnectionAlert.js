// a time alert, that acts basically as an alarm or a reminder. A user
// can set a time alert with a specific timer and a message, and when the timer is up,
// the bot will echo a message to the user. After reminding, the aler is deleted from DB.


const { SlashCommandBuilder } = require('discord.js');
const { ConnectionAlerts } = require ('../../db/database.js');
const { addAPItoDB } = require ('../../utils/addAPItoDB.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-connection-alert')
		.setDescription('Set a connection alert with a timeframe in which you expect to receive values.')
        .addStringOption(option =>
            option.setName('api')
                .setDescription('your project API key')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('field-id')
                .setDescription('FieldID you want alert for')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('time')
            .setDescription('Time in seconds that the reminder will be set for')
            .setRequired(true)),
            
	async execute(interaction) {
		const apiKey = interaction.options.getString('api');
        const fieldID = interaction.options.getInteger('field-id');
        const time = interaction.options.getNumber('time');

        try{
            const connectionAlert = await ConnectionAlerts.create({
                apiKey: apiKey,
                fieldID: fieldID,
                username: interaction.user.username,
                setTime: time,
                timeStamp: Math.floor(Date.now() / 1000), // current time in seconds
            });

            return interaction.reply(`Connection alert with an id of \`${connectionAlert.id}\` has been set for \`${time}\` seconds.`);
        }

        catch(error)
        {
            if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply(`**Alert with API key: \`${apiKey}\` and field ID: \`${fieldID}\` already exists. Delete previous alert and create a new one.**`);
			}
            else{
                return interaction.reply('Something went wrong with adding a connection alert.');
            }
        }


		
	},
};