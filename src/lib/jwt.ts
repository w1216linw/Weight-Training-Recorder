import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

export async function encrypt(payload: Record<string, string>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
