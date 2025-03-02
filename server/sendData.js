const { MongoClient } = require("mongodb");
const fs = require("fs");

// Replace with your MongoDB connection string
const connectionString = "mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster";

// Read JSON files
const readJSON = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

async function insertData() {
    const client = new MongoClient(connectionString);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("test");

        // Read data from JSON files
        const predictionData = readJSON("predictionDB.json");
        const questionnaireData = readJSON("questionnerSurvey.json");

        // Insert into predictionDB
        const predictionCollection = db.collection("predictionDB");
        await predictionCollection.insertMany(predictionData);
        console.log("Inserted data into predictionDB");

        // Insert into questionnerSurvey
        const questionnaireCollection = db.collection("questionnairesubmissions");
        await questionnaireCollection.insertMany(questionnaireData);
        console.log("Inserted data into questionnairesubmissions");

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    } finally {
        await client.close();
        console.log("MongoDB connection closed.");
    }
}

insertData();



// const { MongoClient } = require("mongodb");

// // Replace with your actual MongoDB connection string
// const connectionString = "mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster";

// async function fetchData() {
//     const client = new MongoClient(connectionString);

//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         const db = client.db("test");

//         // Access the 'predictionDB' collection
//         const predictionCollection = db.collection("predictionDB");
//         console.log("Documents in predictionDB:");
//         const predictionDocs = await predictionCollection.find().toArray();
//         console.log(predictionDocs);

//         // Access the 'questionnairesubmissions' collection
//         const questionnaireCollection = db.collection("questionnairesubmissions");
//         console.log("\nDocuments in questionnairesubmissions:");
//         const questionnaireDocs = await questionnaireCollection.find().toArray();
//         console.log(questionnaireDocs);

//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//     } finally {
//         await client.close();
//         console.log("MongoDB connection closed.");
//     }
// }

// fetchData();

// const { MongoClient } = require("mongodb");
// const fs = require("fs");


// async function insertData() {
//     const client = new MongoClient(uri);
//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         const db = client.db("test"); // Change to your database name

//         // Read and insert predictionDB.json
//         const predictionData = JSON.parse(fs.readFileSync("predictionDB.json", "utf8"));
//         await db.collection("predictionDB").insertMany(predictionData);
//         console.log("Inserted predictionDB data");

//         // Read and insert questionnerSurvey.json
//         const surveyData = JSON.parse(fs.readFileSync("questionnerSurvey.json", "utf8"));
//         await db.collection("questionnerSurvey").insertMany(surveyData);
//         console.log("Inserted questionnerSurvey data");

//     } catch (error) {
//         console.error("Error inserting data:", error);
//     } finally {
//         await client.close();
//     }
// }

// insertData();
