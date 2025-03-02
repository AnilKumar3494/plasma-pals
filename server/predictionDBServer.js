const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5001; // You can use a different port for this servercd

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (using the same connection string)
mongoose.connect('mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected (Prediction Server)'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for the predictionDB collection
const predictionSchema = new mongoose.Schema({
    email: String,
    goal: Number,
    donations: Number,
    lastVisit: String, // Or Date if you want to store as a Date object
    prediction: Number,
    Q1: Number,
    Q2: Number,
    Q3: Number,
    Q4: Number,
    Q5: Number,
});

// Create the model
const PredictionModel = mongoose.model('Prediction', predictionSchema, 'predictionDB'); // Explicitly specify the collection name

// API Endpoint to handle POST requests for predictions
app.post('/api/submit-prediction', async (req, res) => {
    try {
        const predictionData = new PredictionModel(req.body);
        const savedData = await predictionData.save();
        res.status(201).json({ message: 'Prediction saved successfully!', data: savedData });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ message: 'Error saving prediction.', error: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Prediction Server listening on port ${port}, with end point /api/submit-prediction`);
});