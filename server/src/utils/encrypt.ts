import crypto from 'crypto';
import { Config } from '../schemas';

const algorithm = 'aes-256-cbc';

const encrypt = (text: string, key: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (text: string, key: string): string => {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const encryptConfig = (config: Config, encryptionKey: string) => {
    const { apiKey } = config;
    return {
        ...config,
        apiKey: apiKey ? encrypt(apiKey, encryptionKey) : apiKey,
    }
};

export const decryptConfig = (config: Config, encryptionKey: string) => {
    const { apiKey } = config;
    return {
        ...config,
        apiKey: apiKey ? decrypt(apiKey, encryptionKey) : apiKey,
    };
};
