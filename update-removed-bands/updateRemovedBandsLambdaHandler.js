const CompetitionMessageParser = require("../shared-message-parsers/competition-message-parser").CompetitionMessageParser;
const S3Client = require("../s3Client").S3Client;

const mapToLowerCaseAndTrim = (values) => {
    return values.map(x => x.trim().toLowerCase());
}

exports.handler = async (event, context) => {
    console.error('starting');
    const competition = new CompetitionMessageParser(event).getCompetition();
    const request = event.body;
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
        const removedBandsBefore = response && response.removedBands ? mapToLowerCaseAndTrim(response.removedBands) : [];
        const bandsToAddBack = removedBandsBefore.filter(band => !mapToLowerCaseAndTrim(request.removedBands).includes(band.trim().toLowerCase()));
        const bandsToRemove = request.removedBands.filter(band => !removedBandsBefore.includes(band.trim().toLowerCase()));
        console.error(bandsToAddBack);
        console.error(bandsToRemove);
        const appsToAddBack = completedSubmissions.completedApplications.filter(app => mapToLowerCaseAndTrim(bandsToAddBack).includes(app.bandName.trim().toLowerCase()));
        const schedule = await s3Client
            .getObject('bitter-jester-lake', `${competition}/user-friday-night-schedule.json`);
        const updatedNights = schedule.nights.map(night => {
            const bandsForNightWithSomeRemoved = night.bands.filter(band => !mapToLowerCaseAndTrim(bandsToRemove).includes(band.bandName.trim().toLowerCase()));
            return {
                ...night,
                bands: bandsForNightWithSomeRemoved,
            }
        });
        updatedNights[0].bands.unshift(...appsToAddBack)
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