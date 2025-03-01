// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express application
const app = express();
const port = 3001;

// Configure middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'app_user',
  host: 'localhost',
  database: 'my_app_db',
  password: 'secure_password',
  port: 5432,
});

// Test database connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database');
  }
});

// API endpoint to handle questionnaire submissions
app.post('/api/questionnaire/submissions', async (req, res) => {
  try {
    // Extract data from the request body
    const formData = req.body;
    
    // Extract fields from the form data
    const timestamp = new Date(formData.Timestamp);
    const customerID = parseInt(formData["User ID"], 10);
    
    // Extract question answers - need to get the question keys dynamically
    // We're looking for the 5 question fields in the form data
    const questionKeys = Object.keys(formData).filter(key => 
      key !== "Timestamp" && key !== "User ID"
    );
    
    // Convert answers to BIT (0 or 1)
    // Assuming answers are boolean or 0/1 values
    const questionValues = {};
    questionKeys.forEach((key, index) => {
      // Convert answer to 0 or 1 (BIT)
      const answerValue = formData[key] ? 1 : 0;
      questionValues[`question${index + 1}`] = answerValue;
    });
    
    // Prepare SQL query
    const query = `
      INSERT INTO visits (customerID, question1, question2, question3, question4, question5, timeofVisit)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING visitID
    `;
    
    // Execute the query with parameters
    const values = [
      customerID,
      questionValues.question1 || 0,
      questionValues.question2 || 0,
      questionValues.question3 || 0,
      questionValues.question4 || 0,
      questionValues.question5 || 0,
      timestamp
    ];
    
    const result = await pool.query(query, values);
    
    // Return success response with the newly created visitID
    res.status(201).json({
      success: true,
      message: 'Questionnaire submission recorded successfully',
      visitID: result.rows[0].visitID
    });
    
  } catch (error) {
    console.error('Error processing questionnaire submission:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Failed to record questionnaire submission',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Questionnaire API server running on port ${port}`);
});