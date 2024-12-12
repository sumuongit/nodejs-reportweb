const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const reportRoute = require('./routes/report');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
//const sendEmail = require("../server/utils/send-email");

const app = express();
const PORT = process.env.PORT || 5004;
const mongoDbString = process.env.DATABASE_CONN;

let ORIGIN = '';
if (process.env.NODE_ENV === 'development') {
    ORIGIN = process.env.DEV_ORIGIN;
} else if (process.env.NODE_ENV === 'production') {
    ORIGIN = process.env.PRO_ORIGIN;
} else {
    console.log('Running server in unknown or development mode');
}

const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
    ],
};

// Middleware
app.use(express.json());
//app.use(cors({ origin: ORIGIN }));
app.use(cors(corsOptions));
app.use('/api', userRoute);
app.use('/api', reportRoute);

// Serve static files from the VitePress `dist` directory
//app.use(express.static(path.join(__dirname, '..', 'root', '.vitepress', 'dist')));
app.use(express.static(path.join(__dirname, 'public/dist')));

// Call API
// app.post('/api/send-email', async (req, res) => {
//     const { name, designation, email, phoneNumber, message, companyName, industryName } = req.body;
//     try {
//         const sent = await sendEmail({ name, designation, email, phoneNumber, message, companyName, industryName });

//         if (sent.error) {
//             return res.status(500).json({ error: 'Error sending email' });
//         }
//         return res.status(200).json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Catch-all route to serve the index.html for any undefined routes (single-page app fallback)
app.get('*', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'root', '.vitepress', 'dist', 'index.html'));
    res.sendFile(path.join(__dirname, 'public/dist/index.html'));
});

mongoose.connect(mongoDbString);
const database = mongoose.connection;
// database.on('error', (error) => {
//     console.log(error);
// })

database.on('error', (error) => {
    console.error('Database connection error:', error);
});

database.once('connected', () => {
    console.log('Database Connected');
})

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${ORIGIN} mode`);
});
