const {handler} = require('./update-removed-bands/updateRemovedBandsLambdaHandler');

const run = async () => {
    const removedBands = ["MTN AIR","Bed Heads, The","Alpha The Artist","D-Wedgies","F.L.A.M.E.","Funk For Food","Laikaa","Luscia Jane","Moon Rules Apply ","Polly On the Wall","Recovery, The","Root Cause, The","Rotting King","SPARKY","Scumbag Skippy","Sugar Weather","Voodoo Dolls, The","Nobodys","Geology Club","No Shelter"];
    const response = await handler({body: JSON.stringify({removedBands}), competitionId: 'bitter_jester_summer_2022'});
    console.error(response);
}

run();