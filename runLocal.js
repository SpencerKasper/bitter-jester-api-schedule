const {handler} = require('./get-judges-schedule/getJudgesScheduleLambdaHandler');

const run = async () => {
    const response = await handler({competitionId: 'bitter_jester_summer_2022'});
    console.error(response);
}

run();