require('dotenv').config();

const GetScheduleMessageParser = require("./get-schedule-message-parser").GetScheduleMessageParser;
const GetSuggestedScheduleHandler = require("./get-suggested-schedule-handler").GetSuggestedScheduleHandler;
const GetSavedScheduleHandler = require("./get-saved-schedule-handler").GetSavedScheduleHandler;

const S3Client = require('s3Client').S3Client;
const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;

const s3Client = new S3Client();
const S3_BUCKET = 'bitter-jester-test';

const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';
const LAST_SAVED_SCHEDULE_TYPE = 'user-friday-night-schedule';

const handler = async function (event, context) {
    try {
        const parsedMessage = new GetScheduleMessageParser(event).get();
        console.error(`Processing competition w/ params: ${JSON.stringify(parsedMessage)}`);
        const {scheduleType, competition, orderedShowcaseBands} = parsedMessage;
        if(scheduleType === SUGGESTED_SCHEDULE_TYPE){
            console.error('Getting suggested schedule...');
            const suggestedSchedule = await new GetSuggestedScheduleHandler(s3Client, competition, orderedShowcaseBands).get();
            console.error(`Output: ${JSON.stringify(suggestedSchedule)}`);
            return {responseCode: 200, body: suggestedSchedule};
        }
        console.error('Getting saved schedule...');
        const savedSchedule = await new GetSavedScheduleHandler(s3Client, competition).get();
        console.error(`Output: ${JSON.stringify(savedSchedule)}`);
        return {responseCode: 200, body: savedSchedule};
    } catch (e) {
        return e;
    }
};

module.exports = {
    handler,
    BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
    S3_BUCKET,
    SUGGESTED_SCHEDULE_TYPE,
    LAST_SAVED_SCHEDULE_TYPE
}
