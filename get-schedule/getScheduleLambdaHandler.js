require('dotenv').config();

const GetScheduleMessageParser = require("./get-schedule-message-parser").GetScheduleMessageParser;
const GetSuggestedScheduleHandler = require("./get-suggested-schedule-handler").GetSuggestedScheduleHandler;
const GetSavedScheduleHandler = require("./get-saved-schedule-handler").GetSavedScheduleHandler;

const S3Client = require('s3Client').S3Client;

const s3Client = new S3Client();
const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';

exports.handler = async function (event, context) {
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
