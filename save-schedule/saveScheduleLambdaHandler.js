require('dotenv').config();

const {CompetitionMessageParser} = require("../shared-message-parsers/competition-message-parser");
const S3Client = require('../s3Client').S3Client;

exports.handler = async function (event, context) {
    try {
        const competition = new CompetitionMessageParser(event).getCompetition();
        console.error(`Saving to competition: ${competition}`);
        const schedule = event.body;
        console.error(JSON.stringify(schedule));
        const s3Client = new S3Client();
        await s3Client.put(
            s3Client.createPutPublicJsonRequest(
                'bitter-jester-lake',
                `${competition}/user-friday-night-schedule.json`,
                JSON.stringify(schedule),
            )
        )
        return {responseCode: 200, body: {schedule}};
    } catch (e) {
        console.error(e);
        return e;
    }
};
