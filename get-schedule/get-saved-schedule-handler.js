const formatCompletedApplications = require("../jotform-formatters/formatCompletedApplications");
const writeToS3FromJotForm =  require("../writeToS3FromJotForm/writeToS3FromJotForm");
const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = require("./getScheduleLambdaHandler").BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID;

class GetSavedScheduleHandler {
    constructor(s3Client, competition){
        this.s3Client = s3Client;
        this.competition = competition;
    }

    async get() {
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
            `${this.competition}/completed-submissions.json`,
            formatCompletedApplications.format,
            this.s3Client
        );
        console.error('Got submissions.');
        const schedule = await this.s3Client
            .getObject('bitter-jester-test', `${this.competition}/user-friday-night-schedule.json`);
        console.error('Got saved schedule.');
        const updatedNights = [];
        for(let night of schedule.nights){
            const updatedBandsForNight = night.bands.map(band => submissions.completedApplications.find(sub => sub.bandName === band.bandName));
            updatedNights.push({...night, bands: updatedBandsForNight});
        }
        console.error('Grabbed new information.');
        return {...schedule, nights: updatedNights};
    }
}

module.exports = {
    GetSavedScheduleHandler
}