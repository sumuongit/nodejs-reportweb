exports.read = async function (req, res) {
    try {
        const reportExternalUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYjJkZjQxNzAtY2U1My00OWMyLTk5YWYtOGUyMjkxZmQyZDM5IiwidCI6ImM5Y2NlOGY1LWJjOTgtNDU4Yi04NmE0LWZlYWMwZjcyODc4MyIsImMiOjEwfQ%3D%3D';
        res.status(200).json({
            success: true,
            url: reportExternalUrl,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the report URL.',
        });
    }
};
