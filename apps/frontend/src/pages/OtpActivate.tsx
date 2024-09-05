import React, { useState, useEffect } from 'react';
import {  AlertCircle } from 'lucide-react';
import { verifyOtp } from '../service/apiVerifyOtp';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../service/apiSendOtp';
import { emailAtom, isAuthenticated, passwordAtom, tokenAtom, usernameAtom } from '../store/atoms/user';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userSignUp } from '../service/apiAuthSignup';

export default function OTPActivation() {
  const [otp, setOtp] = useState<any>();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [, setSuccess] = useState(false);
  const navigate = useNavigate()
  const [email]=useRecoilState(emailAtom)
  const setAuth= useSetRecoilState(isAuthenticated)
  const setToken=useSetRecoilState(tokenAtom)
  const [username,setUsername]=useRecoilState(usernameAtom)
  const [password,]=useRecoilState(passwordAtom);



  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("otp is ",otp)
    let OTP
    if(otp){
      OTP = parseInt(otp)
    }
    if(!OTP || OTP && OTP.toString().length!=6){
      console.log("otp is " + otp + " len ")
      toast.error("OTP length must be 6")
      return
    }
    // This is where you'd typically send the OTP to your backend for verification
    
    const isOTP = await verifyOtp(OTP,setSuccess)
    if (isOTP===true) { // Replace with actual OTP verification logic
        toast.success("Account activated")
        await userSignUp(username,email,password,setUsername,setToken,navigate,setAuth)
        navigate("/blogs")
    } else {
      toast.error("Otp doesn't match")
    }
  };

  const handleResend =async () => {
    // This is where you'd typically trigger a new OTP to be sent
    await sendOtp(email)
    setTimer(30);
    setCanResend(false);
    setError('');
    // Add logic here to resend OTP
  };


  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Activate Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
          <input
            id="otp"
            type="number"
            placeholder="Enter the 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-3 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Activate Account
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
        </p>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`mt-2 text-blue-600 hover:text-blue-800 ${!canResend && 'opacity-50 cursor-not-allowed'}`}
        >
          Resend OTP
        </button>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      )}
    </div>
  );
}