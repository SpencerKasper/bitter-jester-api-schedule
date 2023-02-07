const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    bandName: '39',
    primaryEmailAddress: '289',
    firstChoiceFridayNight: '77',
    secondChoiceFridayNight: '78',
    isBandAvailableOnAllFridays: '232',
    primaryPhoneNumber: '312',
    citiesRepresented: '315',
    unavailableFridayNights: '80',
    referencedBands: '303'
};

const format = (applications, jotformId, answerMap = jotformAnswerMap) => {

    const convertIsBandAvailableOnFridays = (app) => {
        return !app.unavailableFridayNights || !app.unavailableFridayNights.length;
    };

    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, answerMap);
    const cleanedApplications = extractedApplications.map(app => {
        const firstChoiceFridayNight = app.firstChoiceFridayNight;
        const secondChoiceFridayNight = app.secondChoiceFridayNight;
        app.primaryPhoneNumber = app.primaryPhoneNumber ? app.primaryPhoneNumber.full : '';
        app.isBandAvailableOnAllFridays = convertIsBandAvailableOnFridays(app);
        if (!firstChoiceFridayNight && app.isBandAvailableOnAllFridays) {
            app.firstChoiceFridayNight = 'Available Every Friday'
        } else if (!firstChoiceFridayNight) {
            app.firstChoiceFridayNight = 'No Preference Aside From Unavailable'
        }

        if (!secondChoiceFridayNight) {
            app.secondChoiceFridayNight = '';
        }
        return app;
    });

    return {
        completedApplications: cleanedApplications,
        jotformId
    };
};

module.exports = {
    format: format
}