// a time alert, that acts basically as an alarm or a reminder. A user
// can set a time alert with a specific timer and a message, and when the timer is up,
// the bot will echo a message to the user. After reminding, the aler is deleted from DB.


const { SlashCommandBuilder } = require('discord.js');
const { ThresholdAlerts } = require ('../../db/database.js');
const { addAPItoDB } = require ('../../utils/addAPItoDB.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-threshold-alert')
		.setDescription('Set a threshold alert. You can set both maximum or/and minimum.')
        .addStringOption(option =>
            option.setName('api')
                .setDescription('your project API key')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('field-id')
                .setDescription('FieldID you want alert for')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('threshold-min')
            .setDescription('If a value lower than this is received, an alert is sent.')
            .setRequired(false))
        .addNumberOption(option =>
            option.setName('threshold-max')
            .setDescription('If a value higher than this is received, an alert is sent.')
            .setRequired(false)),
            
	async execute(interaction) {
		const apiKey = interaction.options.getString('api');
        const fieldID = interaction.options.getInteger('field-id');
        const thresholdMin = interaction.options.getNumber('threshold-min');
        const thresholdMax = interaction.options.getNumber('threshold-max');


        try{
            const thresholdAlert = await ThresholdAlerts.create({
                apiKey: apiKey,
                fieldID: fieldID,
                username: interaction.user.username,
                thresholdMin: thresholdMin,
                thresholdMax: thresholdMax,
            });

            return interaction.reply(`threshold alert with an id of \`${thresholdAlert.id}\`, \`${thresholdAlert.thresholdMin}\` min and \`${thresholdAlert.thresholdMax}\` max has been set.`);
        }

        catch(error)
        {
            if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply(`**Alert with API key: \`${apiKey}\` and field ID: \`${fieldID}\` already exists. Delete previous alert and create a new one.**`);
			}
            else{
                return interaction.reply(`Something went wrong with adding a threshold alert. ${error}`);
            }
        }


		
	},
};