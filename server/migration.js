const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected for migration');
    runMigration();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

async function runMigration() {
    try {
        const FormDataModel = mongoose.model('QuestionnaireSubmission', new mongoose.Schema({
            userId: String,
            question1: Number,
            question2: Number,
            question3: Number,
            question4: Number,
            question5: Number,
            timeofVisit: String,
        }));

        const documents = await FormDataModel.find({});

        for (const doc of documents) {
            if (doc.userId) {
                doc.email = doc.userId; // Copy userId to email
                delete doc.userId; // Delete userId
            }
            delete doc.timeofVisit; // Delete timeofVisit
            await doc.save();
        }

        console.log('Migration completed successfully.');
        mongoose.disconnect(); // Disconnect after migration
    } catch (error) {
        console.error('Migration error:', error);
        mongoose.disconnect();
    }
}