const {handler} = require('./get-schedule/getScheduleLambdaHandler');

const run = async () => {
    await handler({competitionId: 'bitter_jester_summer_2022'});
}

run();