// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Require Sequelize
const Sequelize = require('sequelize'); // the ORM

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

//define 3 models for timeAlert, thresholdAlert, and connectionAlert
const TimeAlerts = sequelize.define('timeAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	  },
	APIkey: Sequelize.STRING,
	fieldID: Sequelize.INTEGER,
	username: Sequelize.STRING,
	message: Sequelize.STRING,
	setTime: Sequelize.INTEGER, //time in seconds that user set
	timeStamp: Sequelize.DOUBLE, //time stamp of when the alert was set or last reminder was sent
});

const ThresholdAlerts = sequelize.define('thresholdAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	  },
	APIkey: Sequelize.STRING,
	fieldID: Sequelize.INTEGER,
	username: Sequelize.STRING,
	thresholdMin: Sequelize.DOUBLE,
	thresholdMax: Sequelize.DOUBLE,
	totalValues: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
	
});


const ConnectionAlerts = sequelize.define('connectionAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	  },
	APIkey: Sequelize.STRING,
	fieldID: Sequelize.INTEGER,
	username: Sequelize.STRING,
	message: Sequelize.STRING,
	setTime: Sequelize.INTEGER, //time in seconds that user set
	timeStamp: Sequelize.DOUBLE, //time stamp of when the alert was set or last reminder was sent
	totalValues: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
});


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

//load commands from commands folder
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);