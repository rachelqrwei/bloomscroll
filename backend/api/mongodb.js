const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

let mongoClient = null;

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

const initialize = async () => {
    mongoClient = new MongoClient(mongoURI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    await mongoClient.connect();
    console.log("Connected to MongoDB");
};

initialize();

module.exports = { mongoClient, initialize };
