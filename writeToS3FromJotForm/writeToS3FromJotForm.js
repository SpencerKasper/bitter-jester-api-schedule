require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const s3Bucket = 'bitter-jester-lake';

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

async function getFormSubmissions(formId, filename, formatFunction, s3Client = new S3Client()) {
    const queryParams = {
        limit: 1000
    }
    console.error('Calling jotform...');
    const response = await jotform.getFormSubmissions(formId, queryParams);
    console.error('Response from jotform received.');
    const formattedResponse = await formatFunction(response, formId);
    // console.error('Formatted: ', formattedResponse);
    const s3PutRequest = s3Client.createPutPublicJsonRequest(
        s3Bucket,
        filename,
        JSON.stringify(formattedResponse)
    );
    await s3Client.put(s3PutRequest);
    return formattedResponse;
}

module.exports = {
    getFormSubmissions: getFormSubmissions
};