// const axios = require('axios');

// exports.read = async function (req, res) {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const reportUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYjJkZjQxNzAtY2U1My00OWMyLTk5YWYtOGUyMjkxZmQyZDM5IiwidCI6ImM5Y2NlOGY1LWJjOTgtNDU4Yi04NmE0LWZlYWMwZjcyODc4MyIsImMiOjEwfQ%3D%3D';
//         const response = await axios.get(reportUrl, {
//             headers: {
//                 Authorization: `Bearer ${token}` 
//             },
//             responseType: 'stream'
//         });

//         response.data.pipe(res); 
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Failed to fetch the report' });
//     }
// };

// exports.read = async function (req, res) {
//     try {
//         const reportExternalUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYjJkZjQxNzAtY2U1My00OWMyLTk5YWYtOGUyMjkxZmQyZDM5IiwidCI6ImM5Y2NlOGY1LWJjOTgtNDU4Yi04NmE0LWZlYWMwZjcyODc4MyIsImMiOjEwfQ%3D%3D';
//         //     res.redirect(reportExternalUrl); 
//         // } catch (err) {
//         //     res.status(500).json({
//         //         success: false,
//         //         message: 'An error occurred while fetching the report.',
//         //     });
//         // }

//         res.status(200).json({
//             success: true,
//             url: reportExternalUrl,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while fetching the report URL.',
//         });
//     }
// };

exports.read = async function (req, res) {
    try {
        const reportExternalUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYjJkZjQxNzAtY2U1My00OWMyLTk5YWYtOGUyMjkxZmQyZDM5IiwidCI6ImM5Y2NlOGY1LWJjOTgtNDU4Yi04NmE0LWZlYWMwZjcyODc4MyIsImMiOjEwfQ%3D%3D';
        
        console.log('Report URL:', reportExternalUrl); 

        res.status(200).json({
            success: true,
            url: reportExternalUrl,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the report URL.',
        });
    }
};
