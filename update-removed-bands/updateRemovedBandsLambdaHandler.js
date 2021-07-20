exports.handler = async (event, context) => {
    console.error('Here is the body');
    console.error(event.body);
    const removedBands = JSON.parse(event.body);
    console.error(removedBands);
    return {statusCode: 200, body: removedBands};
}