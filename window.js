const electron  = require('electron');
const vibrancy  = require('ewc');

class NitrogenWindow extends electron.BrowserWindow{
    constructor(width, height, resizable){
        super({
            width, 
            height,
            resizable: resizable || false,
            transparent: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                experimentalFeatures: true,
                webviewTag: true
            },
            vibrancy: 'dark'
        });

        vibrancy.setAcrylic(this, 0x01010100);

        this.on('ready-to-show', () => {
            this.show();
        });
    }
}

module.exports = NitrogenWindow;