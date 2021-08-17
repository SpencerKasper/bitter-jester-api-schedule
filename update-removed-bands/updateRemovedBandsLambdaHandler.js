const CompetitionMessageParser = require("../shared-message-parsers/competition-message-parser").CompetitionMessageParser;
const S3Client = require("../s3Client").S3Client;

exports.handler = async (event, context) => {
    const competition = new CompetitionMessageParser(event).getCompetition();
    const request = JSON.parse(event.body);

    if(!request.removedBands || !Array.isArray(request.removedBands)){
        return {statusCode: 400, body: {message: 'Bad Request: "removedBands" node must be provided in body as an array of strings.'}};
    }

    const s3Client = new S3Client();
    if(request.removedBands){
        await s3Client.put(s3Client.createPutPublicJsonRequest(
            'bitter-jester-lake',
            `${competition}/removed-bands.json`,
            JSON.stringify({removedBands: request.removedBands})
        ));
    }

    return {statusCode: 200, body: request};
}