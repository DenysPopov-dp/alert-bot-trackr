const { APIs } = require('../db/database.js');

function addAPItoDB(apiKey) {
    //check if the API key is not already in the database
    console.log("trying to add API to DB")
    const existingApi =  APIs.findOne({
        where: {
          api: apiKey,
        },
      });
      console.log(existingApi)

    if(existingApi == null)
    {
        console.log("API not found, adding to DB")
        APIs.create({
            api: apiKey,
        });
    }
}

module.exports = { addAPItoDB };