const {SUGGESTED_SCHEDULE_TYPE, LAST_SAVED_SCHEDULE_TYPE} = require("./getScheduleLambdaHandler");

export class GetScheduleMessageParser {
    constructor(event){
        this.competition = event.competitionId ? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
        this.scheduleType = event.lastSaved ? LAST_SAVED_SCHEDULE_TYPE : SUGGESTED_SCHEDULE_TYPE;
        this.orderedShowcaseBands = event.orderedShowcaseBands ? event.orderedShowcaseBands.split(',') : [];
    }

    get() {
        const {competition, scheduleType, orderedShowcaseBands} = this;
        return {competition, scheduleType, orderedShowcaseBands};
    }
}