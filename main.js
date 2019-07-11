const electron  = require('electron');
const vibrancy  = require('ewc');
const fs        = require('fs');
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

var downloadsWindow = null;

function downloadWindow() {
    if(windows.downloadsWindow) return downloadsWindow;
    windows.downloadsWindow = true;
    downloadsWindow = new electron.BrowserWindow({
        width: 1000,
        height: 550,
        resizable: false,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            webviewTag: true
        },
        vibrancy: 'dark'
    });

    vibrancy.setAcrylic(downloadsWindow, 0x00000020);
    
    downloadsWindow.loadFile('views/downloads.html');
    
    downloadsWindow.on('ready-to-show', () => {
        downloadsWindow.show();
    });

    downloadsWindow.on('close', () => {
        downloadsWindow = null;
        windows.downloadsWindow = false;
    });

    return downloadsWindow;
}

electron.app.on('ready', () => {
    if(windows.mainWindow) return;
    windows.mainWindow = true;
    let mainWindow = new electron.BrowserWindow({
        width: 1300,
        height: 800,
        minHeight: 600,
        minWidth: 800,
        resizable: true,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            webviewTag: true
        },
        vibrancy: 'dark'
    });

    mainWindow.setIcon('views/assets/nitrogen.ico');
    mainWindow.setOverlayIcon('views/assets/icon.ico', 'Nitrogen');

    vibrancy.setAcrylic(mainWindow, 0x00000020);
    
    mainWindow.loadFile('views/mainWindow.html');
    
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

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
    windows.settingsWindow = true;
    let settingsWindow = new electron.BrowserWindow({
        width: 630,
        height: 670,
        resizable: false,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            webviewTag: true
        },
        vibrancy: 'dark'
    });

    vibrancy.setAcrylic(settingsWindow, 0x00000020);
    
    settingsWindow.loadFile('views/settings.html');
    
    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    });

    settingsWindow.on('close', () => {
        settingsWindow = null;
        windows.settingsWindow = false;
    });
});

ipcMain.on('openDownloads', () => {
    downloadWindow();
});