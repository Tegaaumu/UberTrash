// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(express.static('public'));

// const upload = multer({ dest: 'uploads/' });

// const KYC_API_KEY = process.env.KYC_API_KEY;
// const KYC_API_SECRET = process.env.KYC_API_SECRET;
// const KYC_API_URL = 'https://api.yourkycprovider.com/verify'; // Replace with your KYC provider's API endpoint

// // Endpoint to start KYC process
// app.post('/kyc', upload.single('document'), async (req, res) => {
//     const { name, email } = req.body;
//     const documentPath = path.join(__dirname, req.file.path);

//     try {
//         // Make a request to the KYC provider's API
//         const response = await axios.post(KYC_API_URL, {
//             apiKey: KYC_API_KEY,
//             apiSecret: KYC_API_SECRET,
//             name,
//             email,
//             document: documentPath
//         });

//         if (response.data.success) {
//             res.json({ message: 'KYC verification successful', data: response.data });
//         } else {
//             res.status(400).json({ message: 'KYC verification failed', error: response.data.error });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const KYC_API_KEY = process.env.KYC_API_KEY;
const KYC_API_SECRET = process.env.KYC_API_SECRET;
const KYC_API_URL = 'https://api.jumio.com/v1/kyc/verify'; // Replace with actual KYC provider's API endpoint

async function verifyIdentity(name, email, documentPath) {
    try {
        const form = new FormData();
        form.append('name', name);
        form.append('email', email);
        form.append('document', fs.createReadStream(documentPath)); // Adjust according to how documents are handled

        const response = await axios.post(KYC_API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${KYC_API_KEY}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('KYC verification successful:', response.data);
    } catch (error) {
        console.error('KYC verification failed:', error.response ? error.response.data : error.message);
    }
}

// Example usage
// verifyIdentity('John Doe', 'john.doe@example.com', './path/to/document.pdf');
