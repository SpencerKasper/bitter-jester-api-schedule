const CompetitionMessageParser = require("../shared-message-parsers/competition-message-parser").CompetitionMessageParser;
const S3Client = require("../s3Client").S3Client;

exports.handler = async (event, context) => {
    const competition = new CompetitionMessageParser(event).getCompetition();
    const request = JSON.parse(event.body);

    if (!request.removedBands || !Array.isArray(request.removedBands)) {
        return {
            statusCode: 400,
            body: {message: 'Bad Request: "removedBands" node must be provided in body as an array of strings.'}
        };
    }

    const s3Client = new S3Client();
    if (request.removedBands) {
        const response = await s3Client.getObject('bitter-jester-lake', `${competition}/removed-bands.json`);
        const completedSubmissions = await s3Client.getObject('bitter-jester-lake', `${competition}/completed-submissions.json`);
        const removedBandsBefore = response && response.removedBands ? response.removedBands : [];
        const bandsToAddBack = removedBandsBefore.filter(band => !request.removedBands.includes(band));
        const bandsToRemove = request.removedBands.filter(band => !removedBandsBefore.includes(band));
        console.error(bandsToAddBack);
        console.error(bandsToRemove);
        const appsToAddBack = completedSubmissions.completedApplications.filter(app => bandsToAddBack.includes(app.bandName));
        const schedule = await s3Client
            .getObject('bitter-jester-lake', `${competition}/user-friday-night-schedule.json`);
        const updatedNights = schedule.nights.map(night => {
            const bandsForNightWithSomeRemoved = night.bands.filter(band => !bandsToRemove.includes(band.bandName));
            return {
                ...night,
                bands: bandsForNightWithSomeRemoved,
            }
        });
        updatedNights[0] = {...updatedNights[0], bands: updatedNights[0].bands.unshift(appsToAddBack)};
        await s3Client.put(
            s3Client.createPutPublicJsonRequest(
                'bitter-jester-lake',
                `${competition}/user-friday-night-schedule.json`,
                JSON.stringify({...schedule, nights: updatedNights}),
            )
        )
        await s3Client.put(s3Client.createPutPublicJsonRequest(
            'bitter-jester-lake',
            `${competition}/removed-bands.json`,
            JSON.stringify({removedBands: request.removedBands})
        ));
    }

    return {statusCode: 200, body: request};
}