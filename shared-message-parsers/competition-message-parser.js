class CompetitionMessageParser {
    constructor(event) {
        this.competition = event.competitionId ? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
    }

    getCompetition() {
        return this.competition;
    }
}

module.exports = {
    CompetitionMessageParser
}