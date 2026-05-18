/**
 * Encryption helpers for user-owned data
 * Uses a password-derived key to encrypt/decrypt payloads
 */

/**
 * Derives a cryptographic key from a password
 * @param {string} password - User password
 * @returns {Promise<CryptoKey>} - CryptoKey for AES-GCM
 */
export const generateKey = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Import raw password bytes as key material
  const keyMaterial = await window.crypto.subtle.importKey('raw', data, { name: 'PBKDF2' }, false, [
    'deriveBits',
    'deriveKey',
  ]);

  // Derive a strong key from the password
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16), // Fixed salt for consistency
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt JSON with AES-GCM
 * @param {object} data - Payload to encrypt
 * @param {string} password - Encryption password
 * @returns {Promise<string>} - Base64 ciphertext (IV + ciphertext)
 */
export const encryptData = async (data: unknown, password: string) => {
  try {
    const key = await generateKey(password);

    // Serialize to JSON
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(jsonString);

    // Random IV (initialization vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt payload
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    // Concatenate IV + ciphertext
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    throw new Error(`Error al cifrar datos: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Decrypt AES-GCM JSON payload
 * @param {string} encryptedBase64 - Base64 ciphertext
 * @param {string} password - Decryption password
 * @returns {Promise<object>} - Parsed JSON
 */
export const decryptData = async (encryptedBase64: string, password: string) => {
  try {
    const key = await generateKey(password);

    // Base64 → bytes
    const binaryString = atob(encryptedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // IV = first 12 bytes
    const iv = bytes.slice(0, 12);
    const encryptedData = bytes.slice(12);

    // Decrypt
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    // UTF-8 decode and parse JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(
      `Error al descifrar datos. Contraseña incorrecta o datos corruptos: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

/**
 * Simple integrity hash (not a standalone security primitive)
 * @param {string} data - Payload to hash
 * @returns {string} - Hex digest
 */
export const createChecksum = async (data: unknown) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);

  // Hex encode
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Verify payload matches checksum
 * @param {object} data - Payload to verify
 * @param {string} checksum - Expected checksum
 * @returns {Promise<boolean>} - true if unchanged
 */
export const verifyChecksum = async (data: unknown, checksum: string) => {
  const newChecksum = await createChecksum(data);
  return newChecksum === checksum;
};
