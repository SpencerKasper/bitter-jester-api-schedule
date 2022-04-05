const formatCompletedApplications = require("../jotform-formatters/formatCompletedApplications");

const S3_BUCKET = 'bitter-jester-lake';
const generateFridayNightBattleSchedule = require("./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule");
const writeToS3FromJotForm = require("../writeToS3FromJotForm/writeToS3FromJotForm");
const {COMPETITION_ID_JOTFORM_ID_MAP} = require("./competitionIdJotformIdMap");

class GetSuggestedScheduleHandler {
    constructor(s3Client, competition, orderedShowcaseBands) {
        this.s3Client = s3Client;
        this.competition = competition;
        this.orderedShowcaseBands = orderedShowcaseBands;
    }

    async get() {
        const jotformId = COMPETITION_ID_JOTFORM_ID_MAP[this.competition.split('=')[1]];
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            jotformId.completedApps,
            `${this.competition}/completed-submissions.json`,
            formatCompletedApplications.format,
            this.s3Client
        );
        console.error(JSON.stringify(submissions));
        const response = await this.s3Client.getObject(S3_BUCKET, `${this.competition}/removed-bands.json`);
        const removedBands = response && response.removedBands ? response.removedBands : [];
        const applications = submissions.completedApplications.filter(app => !removedBands.includes(app.bandName));
        const competitionId = this.competition.split('=')[1];
        const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(applications, this.orderedShowcaseBands, competitionId);
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
