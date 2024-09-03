import { WSContext } from "hono/ws";

export const clients = new Map<string, WSContext>();

let OTP: number | null = null;

export function setOTP(value: number) {
    OTP = value;
}

export function getOTP(): number | null {
    return OTP;
}
