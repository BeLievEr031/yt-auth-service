import { generateKeyPairSync } from 'crypto';
import fs from 'fs';

// Function to generate keys
function generateKeyPair() {
  // Generate a pair of RSA keys
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // The length of the key in bits
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  // Write the keys to the file system (optional)
  fs.writeFileSync('./certs/private_key.pem', privateKey);
  fs.writeFileSync('./certs/public_key.pem', publicKey);

  // Alternatively, return the keys if you don't want to save them to files
  return { privateKey, publicKey };
}

// Generate and output keys
generateKeyPair();
