require('dotenv').config();

const GetScheduleMessageParser = require("./get-schedule-message-parser").GetScheduleMessageParser;
const {GetSuggestedScheduleHandler} = require("./get-suggested-schedule-handler");
const GetSavedScheduleHandler = require("./get-saved-schedule-handler").GetSavedScheduleHandler;

const S3Client = require('../s3Client').S3Client;

const s3Client = new S3Client();
const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';

exports.handler = async function (event, context) {
    try {
        const parsedMessage = new GetScheduleMessageParser(event).get();
        console.error(`Processing competition w/ params: ${JSON.stringify(parsedMessage)}`);
        const {scheduleType, competition, orderedShowcaseBands} = parsedMessage;
        if(scheduleType === SUGGESTED_SCHEDULE_TYPE){
            const getSuggestedScheduleHandler = new GetSuggestedScheduleHandler(s3Client, competition, orderedShowcaseBands.map(x => x.trim().toLowerCase()));
            const suggestedSchedule = await getSuggestedScheduleHandler.get();
            // console.error(suggestedSchedule);
            return {responseCode: 200, body: suggestedSchedule};
        }
        const getSavedScheduleHandler = new GetSavedScheduleHandler(s3Client, competition);
        const savedSchedule = await getSavedScheduleHandler.get();
        // console.error(`Output: ${JSON.stringify(savedSchedule)}`);
        return {responseCode: 200, body: savedSchedule};
    } catch (e) {
        return e;
    }
};
