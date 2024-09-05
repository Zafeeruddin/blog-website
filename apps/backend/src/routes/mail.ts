import {  getOTP, setOTP } from "../services/declarations";
import { userRouter } from "./user";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}


userRouter.post("/sendOTP", async (c) => {
    try {
        const body = await c.req.json()
        const otp = generateOTP()
        const reciepientEmail= body.email
        console.log("otp is ",otp)
        setOTP(otp)
        const response = await fetch("https://api.mailjet.com/v3/send", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${btoa(`${c.env.MJ_APIKEY_PUBLIC}:${c.env.MJ_APIKEY_PRIVATE}`)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                FromEmail: "mohammed.xafeer@gmail.com",
                FromName: "Your Blogging Website",
                Recipients: [
                    {
                        Email: `${reciepientEmail}`,
                        Name: "Dear User"
                    }
                ],
                Subject: "Your One-Time Password (OTP) for Account Verification",
                "Text-part": `Hello, and welcome to our Blogging Website! Your OTP for account verification is ${otp}. Please enter this code on the verification page to complete your registration. Happy blogging!`,
                "Html-part": `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h3>Hello, and welcome to our Blogging Website!</h3>
                    <p>Your OTP for account verification is:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #2a9d8f;">${otp}</div>
                    <p>Please enter this code on the verification page to complete your registration.</p>
                    <p>Happy blogging!</p>
                    <p>Best Regards,<br />The Blogging Website Team</p>
                </div>
            `
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error response:", response.status, response.statusText);
        }

        console.log("result", result);
        c.status(201)
        return c.json(JSON.stringify(result));
    } catch (e) {
        console.error("Error:", e);
        c.status(404)
        return c.json("error");
    }
});

userRouter.post("/checkOTP",async (c)=>{
    
    const otp = getOTP()
    const body = await c.req.json()
    console.log("otp is",body.otp)
    if (body.otp===otp){
        c.status(202)
        return c.json("Welcome to blogging world")
    }else{
        c.status(406)
        return c.json("OTP doesn't match")
    }
})