const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser'); // No longer need to install body-parser separately for JSON

const app = express();
const port = 5000; // Choose a port for your backend

// Middleware
app.use(cors()); // Enable CORS for all routes (or configure more specifically)
app.use(express.json()); // Parse JSON request bodies - Using built-in Express middleware!
// app.use(bodyParser.json()); // Comment out bodyParser.json() - not needed with newer Express

// MongoDB Connection (Replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define your Mongoose Schema and Model (e.g., for your form data)
const formDataSchema = new mongoose.Schema({
    email: String,
    Q1: Number, // Assuming 1 for Yes, 0 for No
    Q2: Number,
    Q3: Number,
    Q4: Number,
    Q5: Number,
});

const FormDataModel = mongoose.model('QuestionnaireSubmission', formDataSchema); // Changed model name to 'QuestionnaireSubmission', collection will be 'questionnairesubmissions' in MongoDB

// API Endpoint to handle POST requests from React
app.post('/api/submit-form', async (req, res) => {
    try {
        // console.log('Request Body:', req.body);
        const formData = new FormDataModel(req.body); // Create a new document from the request body
        const savedData = await formData.save(); // Save to MongoDB
        res.status(201).json({ message: 'Data saved successfully!', data: savedData }); // Send success response
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data.', error: error }); // Send error response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Survey Questionnaire Server listening on port ${port}`);
});