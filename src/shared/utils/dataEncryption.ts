/**
 * Sistema de cifrado para datos del usuario
 * Usa una clave derivada de contraseña para cifrar/descifrar datos
 */

/**
 * Genera una clave criptográfica a partir de una contraseña
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<CryptoKey>} - Clave criptográfica
 */
export const generateKey = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Crear una clave a partir de la contraseña
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derivar una clave segura de la contraseña
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16), // Salt fijo para consistencia
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
 * Cifra datos JSON con AES-GCM
 * @param {object} data - Datos a cifrar
 * @param {string} password - Contraseña para cifrado
 * @returns {Promise<string>} - Datos cifrados en base64
 */
export const encryptData = async (data, password) => {
  try {
    const key = await generateKey(password);

    // Convertir datos a JSON
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(jsonString);

    // Generar IV (vector de inicialización) aleatorio
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Cifrar los datos
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    // Combinar IV + datos cifrados
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convertir a base64 para almacenar
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (error) {
    throw new Error(`Error al cifrar datos: ${error.message}`);
  }
};

/**
 * Descifra datos JSON cifrados con AES-GCM
 * @param {string} encryptedBase64 - Datos cifrados en base64
 * @param {string} password - Contraseña para descifrado
 * @returns {Promise<object>} - Datos descifrados
 */
export const decryptData = async (encryptedBase64, password) => {
  try {
    const key = await generateKey(password);

    // Convertir de base64 a bytes
    const binaryString = atob(encryptedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extraer IV (primeros 12 bytes)
    const iv = bytes.slice(0, 12);
    const encryptedData = bytes.slice(12);

    // Descifrar
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    // Convertir a string y parsear JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(
      `Error al descifrar datos. Contraseña incorrecta o datos corruptos: ${error.message}`
    );
  }
};

/**
 * Crea un hash simple para validar integridad (no es criptográfico)
 * @param {string} data - Datos a hashear
 * @returns {string} - Hash en hexadecimal
 */
export const createChecksum = async (data) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);

  // Convertir a hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Valida que los datos no fueron modificados
 * @param {object} data - Datos a validar
 * @param {string} checksum - Checksum original
 * @returns {Promise<boolean>} - true si los datos no fueron modificados
 */
export const verifyChecksum = async (data, checksum) => {
  const newChecksum = await createChecksum(data);
  return newChecksum === checksum;
};
