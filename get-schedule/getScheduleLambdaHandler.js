require('dotenv').config();

const {GetScheduleMessageParser} = require("./get-schedule-message-parser");
const {GetSuggestedScheduleHandler} = require("./get-suggested-schedule-handler");
const {GetSavedScheduleHandler} = require("./get-saved-schedule-handler");

const S3Client = require('s3Client').S3Client;
const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;

const s3Client = new S3Client();
const S3_BUCKET = 'bitter-jester-test';

const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';
const LAST_SAVED_SCHEDULE_TYPE = 'user-friday-night-schedule';

const handler = async function (event, context) {
    try {
        const {competition, orderedShowcaseBands, scheduleType} = new GetScheduleMessageParser(event).get();
        if(scheduleType === SUGGESTED_SCHEDULE_TYPE){
            const suggestedSchedule = await new GetSuggestedScheduleHandler(s3Client, competition, orderedShowcaseBands).get();
            return {responseCode: 200, body: suggestedSchedule};
        }

        const savedSchedule = await new GetSavedScheduleHandler(s3Client, competition).get();
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
