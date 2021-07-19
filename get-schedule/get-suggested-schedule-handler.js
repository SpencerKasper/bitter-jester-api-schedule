const S3_BUCKET = 'bitter-jester-test';
const generateFridayNightBattleSchedule = require("./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule");

class GetSuggestedScheduleHandler {
    constructor(s3Client, competition, orderedShowcaseBands){
        this.s3Client = s3Client;
        this.competition = competition;
        this.orderedShowcaseBands = orderedShowcaseBands;
    }

    async get(){
        const item = await this.s3Client.getObject(S3_BUCKET, `${this.competition}/completed-submissions.json`);
        const removedBands = await this.s3Client.getObject(S3_BUCKET, `${this.competition}/removed-bands.json`);
        const applications = item.completedApplications.filter(app => !removedBands.removedBands.includes(app.bandName));
        const schedule = await generateFridayNightBattleSchedule(applications, this.orderedShowcaseBands);
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
