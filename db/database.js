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
	username: Sequelize.STRING,
	message: Sequelize.TEXT,
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
		allowNull: false,
	},
	
});


const ConnectionAlerts = sequelize.define('connectionAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	  },
	APIkey: Sequelize.STRING, //TODO make both unique
	fieldID: Sequelize.INTEGER, //TODO make unique and test, so that you can make only one per field
	username: Sequelize.STRING,
	setTime: Sequelize.INTEGER, //user-set period of time when values should come in, or time to wait before a device is consedered disconnected
	timeStamp: Sequelize.DOUBLE, //time stamp of when the alert was set or last reminder was sent
	totalValues: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
});

module.exports =  { TimeAlerts, ThresholdAlerts, ConnectionAlerts };