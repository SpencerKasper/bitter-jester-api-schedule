const {handler} = require('./get-schedule/getScheduleLambdaHandler');

const run = async () => {
    const response = await handler({competitionId: 'bitter_jester_summer_2022'});
    console.error(response);
}

run();