const _ = require('lodash');
const {getNightMap} = require("../get-night-map");

const MAX_NUMBER_OF_BANDS_PER_NIGHT = 9;

function generateFridayNightBattleSchedule(completedApplications, orderedShowcaseBands, competitionId) {
    const getAvailableBandsForNight = (fridayNightChoice) => {
        return completedApplications
            .filter(app => {
                return app.firstChoiceFridayNight.includes(` ${fridayNightChoice},`);
            });
    };
    const fullyAvailableBands = completedApplications.filter(app => app.isBandAvailableOnAllFridays);
    console.error(fullyAvailableBands);
    const NIGHT_MAP = getNightMap(competitionId);
    const firstChoiceNightOne =  getAvailableBandsForNight(NIGHT_MAP['1']);
    const firstChoiceNightTwo =  getAvailableBandsForNight(NIGHT_MAP['2']);
    const firstChoiceNightThree =  getAvailableBandsForNight(NIGHT_MAP['3']);
    const firstChoiceNightFour =  getAvailableBandsForNight(NIGHT_MAP['4']);
    const nights = [
        {
            bands: firstChoiceNightOne,
            night: 1
        },
        {
            bands: firstChoiceNightTwo,
            night: 2
        },
        {
            bands: firstChoiceNightThree,
            night: 3
        },
        {
            bands: firstChoiceNightFour,
            night: 4
        }
    ];

    // Pass 1 - Move some first choices to second choices
    for (let night of nights) {
        const deepCopyBands = _.cloneDeep(night.bands);
        console.error(`Starting pass for night ${night.night}`);
        console.error(`StartingBandsOnNight: ${night.bands.length}`);
        if (night.bands.length <= MAX_NUMBER_OF_BANDS_PER_NIGHT) {
            console.error(`${night.night} is not over scheduled so continuing.`);
            continue;
        }
        console.error('Bands currently scheduled: ', deepCopyBands);
        for (let band of deepCopyBands) {
            console.error(`BandName: ${band.bandName}`);
            console.error(`PreviouslyScheduledNight: ${night.night}`);
            if (orderedShowcaseBands.includes(band.bandName)) {
                continue;
            }
            if (band.secondChoiceFridayNight !== '' && band.secondChoiceFridayNight !== undefined && band.firstChoiceFridayNight !== band.secondChoiceFridayNight) {
                const secondChoiceFridayNightNumber = Object.values(NIGHT_MAP).findIndex((i) => band.secondChoiceFridayNight.includes(i)) + 1;
                const secondChoiceNight = nights.find(night => night.night === secondChoiceFridayNightNumber);
                console.error(`BandsScheduledOnSecondChoice: ${secondChoiceNight.bands.length}; FirstNight: ${band.firstChoiceFridayNight}; SecondNight: ${band.secondChoiceFridayNight}`);
                if (secondChoiceNight.bands.length < MAX_NUMBER_OF_BANDS_PER_NIGHT) {
                    const indexOfBand = nights[night.night - 1].bands.findIndex((fi) => fi.bandName === band.bandName);
                    const bandToAdd = nights[night.night - 1].bands.splice(indexOfBand, 1);
                    console.error('BandToMove: ', JSON.stringify(bandToAdd));
                    nights[secondChoiceFridayNightNumber - 1].bands.push(bandToAdd[0]);
                }
            }
            if (night.bands.length === MAX_NUMBER_OF_BANDS_PER_NIGHT) {
                console.error('Second choice night is full');
                break;
            }
        }
    }

    // Pass 2 - Add any bands that haven't been added yet and aren't available every friday
    for (const app of completedApplications) {
        let hasBandBeenScheduled = false;
        for (const night of nights) {
            if (app.isBandAvailableOnAllFridays || night.bands.filter(band => band.bandName === app.bandName).length > 0) {
                hasBandBeenScheduled = true;
                break;
            }
        }
        if (hasBandBeenScheduled) {
            continue;
        }
        for (const night of nights) {
            const nightIsNotFull = night.bands.length <= MAX_NUMBER_OF_BANDS_PER_NIGHT;
            const bandIsAvailable = !app.unavailableFridayNights || app.unavailableFridayNights.filter(unavailNight => unavailNight.includes(` ${NIGHT_MAP[night.night]},`)).length === 0;
            if (nightIsNotFull && bandIsAvailable && !hasBandBeenScheduled) {
                nights[night.night - 1].bands.push(app);
                break;
            }
        }
    }

    const schedule = {
        fridayNightOne: nights[0],
        fridayNightTwo: nights[1],
        fridayNightThree: nights[2],
        fridayNightFour: nights[3],
        nights,
        version: 'suggested'
    };


    function getSortedScheduleByLowestNumberOfBands() {
        return schedule.nights.sort((a, b) => a.bands.length < b.bands.length ? -1 : 1);
    }

    function getSortedScheduleByNight() {
        return schedule.nights.sort((a, b) => a.night < b.night ? -1 : 1);
    }

    while (fullyAvailableBands.length > 0) {
        const sortedByLowestNumberOfBands = getSortedScheduleByLowestNumberOfBands();
        schedule.nights.forEach(night => {
            if (sortedByLowestNumberOfBands[0].night === night.night) {
                night.bands.push(fullyAvailableBands.pop());
            }
        });
    }

    getSortedScheduleByNight();
    return schedule;
}

module.exports = {
    generateFridayNightBattleSchedule: generateFridayNightBattleSchedule
};