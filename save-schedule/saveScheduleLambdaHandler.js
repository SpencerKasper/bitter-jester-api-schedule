require('dotenv').config();

const {CompetitionMessageParser} = require("../shared-message-parsers/competition-message-parser");
const S3Client = require('../s3Client').S3Client;
const s3Client = new S3Client();

exports.handler = async function (event, context) {
    try {
        const competition = new CompetitionMessageParser(event).getCompetition();
        const schedule = event.body;
        await s3Client.put(
            s3Client.createPutPublicJsonRequest(
                'bitter-jester-lake',
                `${competition}/user-friday-night-schedule.json`,
                JSON.stringify(schedule),
            )
        )
        return {responseCode: 200, body: {schedule}};
    } catch (e) {
        return e;
    }
};
