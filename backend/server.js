const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

app.get("/run-python", (req, res) => {
    const command = req.query.command;

    console.log(`Executing: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ output: stdout.trim() }); // Always return JSON
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
