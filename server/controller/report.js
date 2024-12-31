const generateSignedUrl = require('../utils/generate-signed-url');

exports.read = async function (req, res) {
    try {
        const signedUrl = await generateSignedUrl('https://app.powerbi.com/view?r=eyJrIjoiYjJkZjQxNzAtY2U1My00OWMyLTk5YWYtOGUyMjkxZmQyZDM5IiwidCI6ImM5Y2NlOGY1LWJjOTgtNDU4Yi04NmE0LWZlYWMwZjcyODc4MyIsImMiOjEwfQ%3D%3D');
        res.status(200).send({ signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error.message);
        res.status(500).send({ message: 'Failed to generate signed URL.' });
    }
};