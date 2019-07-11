const fs        = require('fs');
const homedir   = require('os').homedir() + '/Nitrogen/';

module.exports = ipc => {
    ipc.on('getSettings', e => {
        e.returnValue = require(homedir + 'userData/settings.json');
    });

    ipc.on('getConfig', e => {
        e.returnValue = require('../config.json');
    });

    ipc.on('changeSetting', (e, d) => {
        let settings = require(homedir + 'userData/settings.json');

        settings[d.name[0]][d.name[1]] = d.value;

        fs.writeFileSync(homedir + 'userData/settings.json', JSON.stringify(settings));
    });
};