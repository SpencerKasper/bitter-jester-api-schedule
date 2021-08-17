const S3Client = require("../s3Client").S3Client;
const CompetitionMessageParser = require("../shared-message-parsers/competition-message-parser").CompetitionMessageParser;
exports.handler = async (event, context) => {
    try {
        const competition = new CompetitionMessageParser(event).getCompetition();
        const s3Client = new S3Client();
        const removedBands = await s3Client.getObject('bitter-jester-lake', `${competition}/removed-bands.json`);
        return {statusCode: 200, body: removedBands};
    } catch (e) {
        return e;
    }
}