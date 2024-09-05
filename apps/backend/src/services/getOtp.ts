// // const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
// import mailjet from "node-mailjet"



// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// }

// async function sendOTPEmail(recipientEmail, recipientName) {
//     const otp = generateOTP();
//     try {
//         const request = await mailjet
//             .post("send", { 'version': 'v3' })
//             .request({
//                 "FromEmail": "pilot@mailjet.com",
//                 "FromName": "Your Blogging Website",
//                 "Recipients": [
//                     {
//                         "Email": recipientEmail,
//                         "Name": recipientName
//                     }
//                 ],
//                 "Subject": "Your OTP for Authentication",
//                 "Text-part": `Dear ${recipientName}, your OTP is ${otp}.`,
//                 "Html-part": `<h3>Dear ${recipientName},</h3><br />Your OTP is <strong>${otp}</strong>.`
//             });

//         console.log('Email sent successfully:', request.body);
//         return otp; // Return the OTP for further use if needed
//     } catch (err) {
//         console.log('Error sending email:', err.statusCode);
//         throw err; // Re-throw the error for handling
//     }
// }

// // Usage example
// sendOTPEmail('passenger@mailjet.com', 'Passenger 1')
//     .then(otp => {
//         console.log('OTP sent:', otp);
//     })
//     .catch(err => {
//         console.error('Failed to send OTP:', err);
//     });
