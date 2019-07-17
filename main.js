const electron  = require('electron');
const vibrancy  = require('ewc');
const fs        = require('fs');
const NitrogenW = require('./window.js');
const download  = require('./browser/downloads.js');
const {ipcMain} = electron;
const config    = require('./config.json');
const homedir   = require('os').homedir() + '/Nitrogen/'.replace(/\\/g, '/');


if(!fs.existsSync(homedir)) {
    fs.mkdirSync(homedir);
    fs.mkdirSync(homedir + 'userData/');
}

if(!fs.existsSync(homedir + 'userData/settings.json'))
    fs.writeFileSync(homedir + 'userData/settings.json', JSON.stringify( require('./browser/defaultSettings.js') ));
let settings = require(homedir + 'userData/settings.json');

let windows = {
    mainWindow: false,
    settingsWindow: false,
    downloadsWindow: false
};


// DOWNLOAD MANAGER

var downloadsWindow = null;

function downloadWindow() {
    if(windows.downloadsWindow) return downloadsWindow;
    downloadsWindow = new NitrogenW(1000, 550);

    vibrancy.setAcrylic(downloadsWindow, 0x00000020);
    
    downloadsWindow.loadFile('views/downloads.html');
    
    downloadsWindow.on('ready-to-show', () => {
        downloadsWindow.show();
    });

    windows.downloadsWindow = downloadsWindow;
    downloadsWindow.on('close', () => {
        downloadsWindow = null;
        windows.downloadsWindow = false;
    });

    return downloadsWindow;
}


// MAIN WINDOW

electron.app.on('ready', () => {
    if(windows.mainWindow) return;
    let mainWindow = new NitrogenW(1300, 800, true);

    //mainWindow.setIcon('views/assets/nitrogen.ico');
    //mainWindow.setOverlayIcon('views/assets/icon.ico', 'Nitrogen');

    
    mainWindow.loadFile('views/mainWindow.html');

    windows.mainWindow = mainWindow;
    mainWindow.on('close', () => {
        mainWindow = null;
        windows.mainWindow = false;
    });

    mainWindow.webContents.session.on('will-download', (e, item, webContents) => {
        e.preventDefault();
        let dlfile = new download(item);
        if(!downloadsWindow) downloadWindow();
        dlfile.on('progress', d => {
            downloadWindow().setProgressBar(d.percent);
            dlfile.size = d.size.total;
            downloadWindow().webContents.send('downloadProgress', {d, dlfile});
        });
        dlfile.on('finish', () => {
            downloadWindow().setProgressBar(0);
            downloadWindow().webContents.send('downloadFinish', {dlfile});
        });
    });
});

electron.app.on('Window-all-closed', () => {
    electron.app.quit();
});

require('./browser/ipcEvents.js')(ipcMain);

ipcMain.on('openSettings', () => {
    if(windows.settingsWindow) return;
    
    let settingsWindow = new NitrogenW(630, 670);
    settingsWindow.loadFile('views/settings.html');

    windows.settingsWindow = settingsWindow;
    settingsWindow.on('close', () => {
        settingsWindow = null;
        windows.settingsWindow = false;
    });
});

ipcMain.on('openDownloads', () => {
    downloadWindow();
});

ipcMain.on('settings-blurStyle', (e, style) => {
    Object.values(windows).forEach(w => {
        if(w == 0) return;
        vibrancy['set' + style](w, style == 'Gradient' ? 0x22222222 : 0x00000020);
    });
});