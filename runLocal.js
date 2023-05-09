const {handler} = require('./get-schedule/getScheduleLambdaHandler');

const run = async () => {
    const response = await handler({
        competitionId: 'bitter_jester_summer_2023',
        lastSaved: true,
    });
    console.error(response);
}

run();