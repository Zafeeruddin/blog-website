import { decode, verify } from "hono/jwt";

export async function verifyToken(c: any, token: string) {
    if (!token) {
      c.status(401);
      return { error: "unauthorized" };
    }
    try {
      const verifiedToken = await verify(token, c.env.JWT_SECRET);
      if (!verifiedToken) {
        c.status(401);
        return { error: "The token has been altered" };
      }
  
      const decodedToken = decode(token);
      const userId = decodedToken.payload.id as string;
      return { userId };
    } catch (e) {
      console.log("errors", e);
      return { error: e };
    }
  }
  