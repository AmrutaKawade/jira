const data = require('../../ghae-metadata.json');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require("fs");

function getInstanceMetadata(instanceUrl) {
    for (const ghaeInstance of data) { 
        if ( ghaeInstance.baseUrl === instanceUrl ) {
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

function extractBaseURL(payload) {
    return payload['sender']['url'].split("/users")[0];
}

function getPrivateKey(keyPath) {
    return readFileSync(keyPath, "utf-8");
}

module.exports = {
    getInstanceMetadata,
    getSignedJsonWebToken,
    extractBaseURL,
    getPrivateKey
};