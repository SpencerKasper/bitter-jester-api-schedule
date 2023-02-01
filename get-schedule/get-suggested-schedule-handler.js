const formatCompletedApplications = require("../jotform-formatters/formatCompletedApplications");

const S3_BUCKET = 'bitter-jester-lake';
const generateFridayNightBattleSchedule = require("./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule");
const writeToS3FromJotForm = require("../writeToS3FromJotForm/writeToS3FromJotForm");
const {COMPETITION_ID_JOTFORM_ID_MAP} = require("./competitionIdJotformIdMap");
const {COMPETITION_ID_ANSWER_MAP_MAP} = require('./competitionIdAnswerMapMap');

class GetSuggestedScheduleHandler {
    constructor(s3Client, competition, orderedShowcaseBands) {
        this.s3Client = s3Client;
        this.competition = competition;
        this.orderedShowcaseBands = orderedShowcaseBands;
    }

    async get() {
        const competitionId = this.competition.split('=')[1];
        const jotformId = COMPETITION_ID_JOTFORM_ID_MAP[competitionId];
        const answerMap = COMPETITION_ID_ANSWER_MAP_MAP.hasOwnProperty(competitionId) ?
            COMPETITION_ID_ANSWER_MAP_MAP[competitionId] :
            null;
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            jotformId.completedApps,
            `${this.competition}/completed-submissions.json`,
            (applications, jotformId) => formatCompletedApplications.format(applications, jotformId, answerMap),
            this.s3Client
        );
        const response = await this.s3Client.getObject(S3_BUCKET, `${this.competition}/removed-bands.json`);
        const removedBands = response && response.removedBands ? response.removedBands : [];
        const applications = submissions.completedApplications.filter(app => !removedBands.includes(app.bandName));
        const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(applications, this.orderedShowcaseBands, competitionId);
        console.error(`Night 1: ${schedule.fridayNightOne.bands.length}`);
        console.error(`Night 2: ${schedule.fridayNightTwo.bands.length}`);
        console.error(`Night 3: ${schedule.fridayNightThree.bands.length}`);
        console.error(`Night 4: ${schedule.fridayNightFour.bands.length}`);
        const s3PutRequest = this.s3Client.createPutPublicJsonRequest(
            S3_BUCKET,
            `${this.competition}/friday-night-schedule.json`,
            JSON.stringify(schedule)
        );
        await this.s3Client.put(s3PutRequest);
        return schedule;
    }
}

module.exports = {
    GetSuggestedScheduleHandler: GetSuggestedScheduleHandler
}
