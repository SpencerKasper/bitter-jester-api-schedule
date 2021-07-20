exports.handler = async (event, context) => {
    const removedBands = JSON.parse(event.body);
    console.error(removedBands);
    return {statusCode: 200, body: removedBands};
}