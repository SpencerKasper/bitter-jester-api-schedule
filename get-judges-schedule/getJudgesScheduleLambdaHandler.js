const S3Client = require("../s3Client").S3Client;
const CompetitionMessageParser = require("../shared-message-parsers/competition-message-parser").CompetitionMessageParser;
const formatJudgingApplications = require('../jotform-formatters/formatJudgingApplications');
const writeToS3FromJotForm = require("../writeToS3FromJotForm/writeToS3FromJotForm");
const {COMPETITION_ID_JOTFORM_ID_MAP} = require("../get-schedule/competitionIdJotformIdMap");

exports.handler = async (event, context) => {
    try {
        const competition = new CompetitionMessageParser(event).getCompetition();
        const jotformId = COMPETITION_ID_JOTFORM_ID_MAP[competition.split('=')[1]];
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            jotformId.judgesApps,
            `${competition}/judging-applications.json`,
            formatJudgingApplications.format,
            this.s3Client
        );
        return {statusCode: 200, body: submissions};
    } catch (e) {
        return e;
    }
}