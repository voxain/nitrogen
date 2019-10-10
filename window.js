const electron  = require('electron');
const vibrancy  = require('ewc');

class NitrogenWindow extends electron.BrowserWindow{
    constructor(width, height, resizable){
        super({
            width, 
            height,
            resizable: resizable || false,
            transparent: true,
            show: false,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                experimentalFeatures: true,
                webviewTag: true
            },
            vibrancy: 'dark' /* For MacOS Users if 'ewc' package is disabled. */
        });

        // Set Blurbehind option by default, acrylic is having some problems (on 1903 at least.)
        vibrancy.setBlurBehind(this, 0x01010100);

        this.on('ready-to-show', () => {
            this.show();
        });
    }
}

module.exports = NitrogenWindow;