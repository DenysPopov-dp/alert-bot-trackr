const {APIs, TimeAlerts, ThresholdAlerts, ConnectionAlerts} = require ('./db/database.js');

//get all the APIs registered for alerts
const apis = await APIs.findAll();

//for each API, get all the alerts
for (const api of apis) {
    //get all the time alerts
    const timeAlerts = await TimeAlerts.findAll({
        where: {
            apiKey: api.api
        }
    });

    //get all the threshold alerts
    const thresholdAlerts = await ThresholdAlerts.findAll({
        where: {
            apiKey: api.api
        }
    });

    //get all the connection alerts
    const connectionAlerts = await ConnectionAlerts.findAll({
        where: {
            apiKey: api.api
        }
    });

    //if there are any alerts
    if(timeAlerts.length != 0 || thresholdAlerts.length != 0 || connectionAlerts.length != 0)
    {
        //get the field data
        const fieldData = await api.getFieldData();

        //for each time alert
        for (const timeAlert of timeAlerts) {
            //if the time is right
            if(timeAlert.setTime == new Date().getHours())
            {
                //send the message
                api.sendAlert(timeAlert.username, timeAlert.message);
            }
        }

        //for each threshold alert
        for (const thresholdAlert of thresholdAlerts) {
            //get the field data
            const field = fieldData.find(field => field.id == thresholdAlert.fieldID);

            //if the field exists
            if(field)
            {
                //if the field value is within the threshold
                if(field.value >= thresholdAlert.thresholdMin && field.value <= thresholdAlert.thresholdMax)
                {
                    //send the message
                    api.sendAlert(thresholdAlert.username, `The field \`${field.name}\` is currently at \`${field.value}\` which is within the threshold of \`${thresholdAlert.thresholdMin}\` and \`${thresholdAlert.thresholdMax}\`.`);
                }
            }
        }

        //for each connection alert
        for (const connectionAlert of connectionAlerts) {
            //get the field data
            const field = fieldData.find(field => field.id == connectionAlert.fieldID);

            //if the field exists
            if(field)
            {
                //if the field value is within the threshold
                if(field.value >= connectionAlert.setTime)
                {
                    //send the message
                    api.sendAlert(connectionAlert.username, `The field \`${field.name}\` has been connected for \`${field.value}\` seconds.`);
                }
            }
        }
    }
}