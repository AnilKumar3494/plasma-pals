const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "app_user",
  host: "localhost",
  database: "my_app_db",
  password: "secure_password",
  port: 5432,
});

// API Endpoint to handle form submissions
app.post("/api/questionnaire/submissions", async (req, res) => {
  try {
    const { userId, question1, question2, question3, question4, question5, timeofVisit } = req.body;

    // Find or create the customer
    let result = await pool.query("SELECT customerID FROM customers WHERE email = $1", [userId]);

    let customerID;
    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        "INSERT INTO customers (email, numVisits) VALUES ($1, 1) RETURNING customerID",
        [userId]
      );
      customerID = insertResult.rows[0].customerid;
    } else {
      customerID = result.rows[0].customerid;
      await pool.query("UPDATE customers SET numVisits = numVisits + 1 WHERE customerID = $1", [customerID]);
    }

    // Insert into visits table
    await pool.query(
      `INSERT INTO visits (customerID, question1, question2, question3, question4, question5, timeofVisit) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerID, question1, question2, question3, question4, question5, timeofVisit]
    );

    res.status(201).json({ message: "Submission successful" });
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'app_user',
//   host: 'localhost',
//   database: 'my_app_db',
//   password: 'secure_password',
//   port: 5432,
// });

