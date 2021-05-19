const { sign } = require('jsonwebtoken');
const { AppSecrets } = require('../models');

async function getInstanceMetadata(instanceUrl) {
    return await AppSecrets.getForHost(instanceUrl);
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

module.exports = {
    getInstanceMetadata,
    getSignedJsonWebToken,
    extractBaseURL
};