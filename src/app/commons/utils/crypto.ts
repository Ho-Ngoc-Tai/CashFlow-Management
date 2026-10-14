import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.AES_SECRET_KEY || "flowsync_secure_32_byte_aes_key!";
const IV_KEY = process.env.AES_IV_KEY || "flowsync_iv_16b!";

/**
 * Encrypts data payload using AES-CBC
 */
export function encryptPayload(data: unknown): string {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data);
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, "0").slice(0, 32));
    const iv = CryptoJS.enc.Utf8.parse(IV_KEY.padEnd(16, "0").slice(0, 16));

    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  } catch (error) {
    console.error("[CryptoUtils] Encryption failed:", error);
    return "";
  }
}

/**
 * Decrypts AES-CBC encrypted string back to typed object
 */
export function decryptPayload<T = unknown>(ciphertext: string): T | null {
  try {
    if (!ciphertext || typeof ciphertext !== "string") return null;

    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, "0").slice(0, 32));
    const iv = CryptoJS.enc.Utf8.parse(IV_KEY.padEnd(16, "0").slice(0, 16));

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;

    try {
      return JSON.parse(decryptedString) as T;
    } catch {
      return decryptedString as unknown as T;
    }
  } catch (error) {
    console.error("[CryptoUtils] Decryption failed:", error);
    return null;
  }
}
