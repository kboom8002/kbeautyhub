import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'kbeauty-platform-secret-super-key-12345!'; // Must be at least 32 chars
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export type AuthContext = {
  admin_id: string;
  role: string;
  tenant_id: string; // "SYSTEM" for governance/analyst, or actual "BRAND-###" for brand operators
};

export async function signAuthToken(context: AuthContext): Promise<string> {
  const payload: JWTPayload = {
    sub: context.admin_id,
    role: context.role,
    tenant_id: context.tenant_id
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedKey);
}

export async function verifyAuthToken(token: string): Promise<AuthContext> {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return {
      admin_id: payload.sub as string,
      role: payload.role as string,
      tenant_id: payload.tenant_id as string
    };
  } catch (err) {
    throw new Error('Invalid or Expired Token');
  }
}
