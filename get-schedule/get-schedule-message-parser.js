const CompetitionMessageParser = require('shared-message-parsers/competition-message-parser').CompetitionMessageParser;
const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';
const LAST_SAVED_SCHEDULE_TYPE = 'user-friday-night-schedule';

class GetScheduleMessageParser extends CompetitionMessageParser {
    constructor(event){
        super(event);
        this.scheduleType = event.lastSaved ? LAST_SAVED_SCHEDULE_TYPE : SUGGESTED_SCHEDULE_TYPE;
        this.orderedShowcaseBands = event.orderedShowcaseBands ? event.orderedShowcaseBands.split(',') : [];
    }

    get() {
        return {
            competition: this.getCompetition(),
            scheduleType: this.scheduleType,
            orderedShowcaseBands: this.orderedShowcaseBands,
        };
    }

    getScheduleType() {
        return this.scheduleType;
    }

    getOrderedShowcaseBands() {
        return this.orderedShowcaseBands;
    }
}

module.exports = {
    GetScheduleMessageParser
}