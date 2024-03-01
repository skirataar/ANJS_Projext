const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// SQL Server configuration
const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'localhost',
    database: 'your_database',
    options: {
        encrypt: false, // Change to true if you're using Azure
        trustServerCertificate: true // Change to false if not using a self-signed certificate
    }
};

// Endpoint to save user number and password
app.post('/saveCredentials', async (req, res) => {
    const { userNumber, password } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `INSERT INTO UserCredentials (UserNumber, Password) VALUES (${userNumber}, '${password}')`;
        await request.query(query);
        res.status(200).send('Credentials saved successfully.');
    } catch (error) {
        console.error('Error saving credentials:', error);
        res.status(500).send('Error saving credentials.');
    } finally {
        sql.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
