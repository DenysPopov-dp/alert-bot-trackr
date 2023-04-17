// Require Sequelize
const Sequelize = require('sequelize'); // the ORM

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


const APIs = sequelize.define('APIs', {
	api: {
	  type: Sequelize.STRING,
	  primaryKey: true,
	},
  });


//define 3 models for timeAlert, thresholdAlert, and connectionAlert
const TimeAlerts = sequelize.define('TimeAlerts', {
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

const ThresholdAlerts = sequelize.define('ThresholdAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	// apiKey: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false,
	// 	// references: {
	// 	//   model: 'APIs',
	// 	//   key: 'api',
	// 	//   onDelete: 'CASCADE',
	// 	// },
	// },
	fieldID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	username: Sequelize.STRING,
	thresholdMin: Sequelize.DOUBLE,
	thresholdMax: Sequelize.DOUBLE,
	totalValues: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	
},
{
    indexes: [
        {
            unique: true,
            fields: ['apiKey', 'fieldID']
        }
    ]
});


const ConnectionAlerts = sequelize.define('ConnectionAlerts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	// apiKey: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false,
	// 	// references: {
	// 	//   model: 'APIs',
	// 	//   key: 'api',
	// 	//   onDelete: 'CASCADE',
	// 	// },
	// },
	fieldID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	username: Sequelize.STRING,
	setTime: Sequelize.INTEGER, //user-set period of time when values should come in, or time to wait before a device is consedered disconnected
	timeStamp: Sequelize.DOUBLE, //time stamp of when the alert was set or last reminder was sent
	totalValues: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	
},
{
    indexes: [
        {
            unique: true,
            fields: ['apiKey', 'fieldID']
        }
    ]
});

APIs.hasOne(ConnectionAlerts, {foreignKey: 'apiKey', sourceKey: 'api', onDelete: 'CASCADE'});
APIs.hasOne(ThresholdAlerts, {foreignKey: 'apiKey', sourceKey: 'api', onDelete: 'CASCADE'})

module.exports =  {APIs, TimeAlerts, ThresholdAlerts, ConnectionAlerts };