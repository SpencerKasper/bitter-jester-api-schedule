const {SUGGESTED_SCHEDULE_TYPE, LAST_SAVED_SCHEDULE_TYPE} = require("./getScheduleLambdaHandler");

class GetScheduleMessageParser {
    constructor(event){
        this.competition = event.competitionId ? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
        console.error(LAST_SAVED_SCHEDULE_TYPE);
        console.error(SUGGESTED_SCHEDULE_TYPE);
        this.scheduleType = event.lastSaved ? LAST_SAVED_SCHEDULE_TYPE : SUGGESTED_SCHEDULE_TYPE;
        this.orderedShowcaseBands = event.orderedShowcaseBands ? event.orderedShowcaseBands.split(',') : [];
    }

    get() {
        return {
            competition: this.competition,
            scheduleType: this.scheduleType,
            orderedShowcaseBands: this.orderedShowcaseBands,
        };
    }
}

module.exports = {
    GetScheduleMessageParser
}