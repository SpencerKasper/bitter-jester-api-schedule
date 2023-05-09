const formatCompletedApplications = require("../jotform-formatters/formatCompletedApplications");
const writeToS3FromJotForm = require("../writeToS3FromJotForm/writeToS3FromJotForm");
const {COMPETITION_ID_JOTFORM_ID_MAP} = require("./competitionIdJotformIdMap");

class GetSavedScheduleHandler {
    constructor(s3Client, competition) {
        this.s3Client = s3Client;
        this.competition = competition;
    }

    async get() {
        const jotformId = COMPETITION_ID_JOTFORM_ID_MAP[this.competition.split('=')[1]];
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            jotformId.completedApps,
            `${this.competition}/completed-submissions.json`,
            formatCompletedApplications.format,
            this.s3Client
        );
        const schedule = await this.s3Client
            .getObject('bitter-jester-lake', `${this.competition}/user-friday-night-schedule.json`);
        const updatedNights = [];
        for (let night of schedule.nights) {
            const updatedBandsForNight = night.bands.map(band => {
                if (band.bandName.toLowerCase().includes('green')) {
                    console.error(JSON.stringify(band));
                }
                return submissions.completedApplications.find(sub => this.trimAndLowercase(sub.bandName) === this.trimAndLowercase(band.bandName));
            });
            updatedNights.push({...night, bands: updatedBandsForNight});
        }
        return {...schedule, nights: updatedNights};
    }

    trimAndLowercase(value) {
        return value.trim().toLowerCase();
    }
}

module.exports = {
    GetSavedScheduleHandler
}