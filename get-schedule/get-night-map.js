exports.getNightMap = function (competitionId) {
    if(competitionId === 'bitter_jester_summer_2021') {
        return {
            1: '23',
            2: '30',
            3: '6',
            4: '13'
        };
    } else {
        return {
            1: '20',
            2: '27',
            3: '3',
            4: '10',
        }
    }
}