const fs        = require('fs');

module.exports = ipc => {
    ipc.on('getSettings', e => {
        e.returnValue = require('../userData/settings.json');
    });

    ipc.on('getConfig', e => {
        e.returnValue = require('../config.json');
    });

    ipc.on('changeSetting', (e, d) => {
        let settings = require('../userData/settings.json');

        settings[d.name[0]][d.name[1]] = d.value;

        fs.writeFileSync('./userData/settings.json', JSON.stringify(settings));
    });
};