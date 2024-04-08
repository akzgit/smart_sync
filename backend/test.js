const argon2 = require('argon2');

async function checkPassword(password, hash) {
  try {
    if (await argon2.verify(hash, password)) {
      console.log('Password match!');
    } else {
      console.log('Password does not match.');
    }
  } catch (err) {
    console.log('Verification error:', err);
  }
}

// Replace these with actual values for testing
const testHash = '$2a$08$ovdChNScqBRxoCxVlMmgr.uaH4kDM5GtDqqEwiE.la9rjnVfh5/uG';
const testPassword = '123';

checkPassword(testPassword, testHash);
