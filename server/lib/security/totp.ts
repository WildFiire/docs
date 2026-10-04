import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Allow a slightly larger time window (± 2 steps = ± 60 seconds) for UX tolerance
authenticator.options = { window: 2 };

export const ISSUER = 'docs.wildfire.ro';

/**
 * Generates a new TOTP secret for a user.
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generates a TOTP URI that can be used to create a QR code.
 */
export function getTOTPAuthUri(username: string, secret: string): string {
  const baseUri = authenticator.keyuri(username, ISSUER, secret);
  // URL-ul trebuie să fie accesibil public pentru ca Authy/Google Auth să îl poată descărca
  const baseUrl = process.env.PUBLIC_ORIGIN || 'https://wildfire.ro';
  const imageUrl = encodeURIComponent(`${baseUrl}/icons/wildfire.png`);
  return `${baseUri}&image=${imageUrl}`;
}

/**
 * Generates a Data URL (base64 image) of the QR code for the given URI.
 */
export async function generateQRCodeDataUrl(uri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(uri, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#ff6b00', // WildFire primary color
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verifies a TOTP token against a secret.
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (err) {
    return false;
  }
}
