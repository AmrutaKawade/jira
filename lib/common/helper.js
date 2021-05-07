const data = require('../../ghae-metadata.json');
const { sign } = require('jsonwebtoken');

function getInstanceMetadata(instanceUrl) {
    for (const ghaeInstance of data) { 
        if ( ghaeInstance.baseUrl === instanceUrl ) {
            console.log("GHAE instance: " + ghaeInstance);
            return ghaeInstance;
        }
    }
}

function getSignedJsonWebToken({ appId, privateKey }) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now,
        exp: now + 60 * 10 - 30,
        iss: appId
    };
    const token = sign(payload, privateKey, { algorithm: "RS256" });
    return token;
  }

module.exports = {
    getInstanceMetadata,
    getSignedJsonWebToken
};