const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    hasJudgedBefore: '7',
    numberOfYearsAsJudge: '8',
    bio: '11',
    availableDays: '12',
    phoneNumber: '33',
    firstName: '87',
    lastName: '88',
};

const format = (applications, jotformId) => {

    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
    const cleanedApplications = extractedApplications.map(app => {
        return {
            ...app,
            phoneNumber: app.phoneNumber ? app.phoneNumber.full : ''
        };
    });

    return {
        completedApplications: cleanedApplications,
        jotformId
    };
};

module.exports = {
    format: format
}