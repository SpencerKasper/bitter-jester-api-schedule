const {handler} = require('./get-schedule/getScheduleLambdaHandler');

const run = async () => {
    const response = await handler({competitionId: 'bitter_jester_summer_2023'});
    console.error(response);
}

run();