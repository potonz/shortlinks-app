const ENCODING = "utf-8";
const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;
const TAG_LENGTH = 128;

async function getEncryptionKey(): Promise<CryptoKey> {
    const keyBase64 = process.env.GA4_ENCRYPTION_KEY;
    if (!keyBase64) {
        throw new Error("GA4_ENCRYPTION_KEY environment variable is not set");
    }

    const keyData = Buffer.from(keyBase64, "base64");

    return crypto.subtle.importKey(
        "raw",
        keyData,
        { name: ALGORITHM, length: 256 },
        false,
        ["encrypt", "decrypt"],
    );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    return Buffer.from(buffer).toString("base64");
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    return Buffer.from(base64, "base64").buffer;
}

export async function encrypt(plaintext: string): Promise<string> {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
        key,
        new TextEncoder().encode(plaintext),
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return arrayBufferToBase64(combined.buffer);
}

export async function decrypt(encryptedData: string): Promise<string> {
    const key = await getEncryptionKey();
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedData));

    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
        key,
        ciphertext,
    );

    return new TextDecoder(ENCODING).decode(decrypted);
}
