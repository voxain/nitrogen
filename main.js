const electron = require('electron');
const vibrancy = require('ewc');
const {ipcMain}= electron;

let windows = {
    mainWindow: false,
    settingsWindow: false,
    downloadsWindow: false
};

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

    vibrancy.setAcrylic(mainWindow, 0x00000020);
    
    mainWindow.loadFile('views/mainWindow.html');
    
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('close', () => {
        mainWindow = null;
        windows.mainWindow = false;
    });
});

electron.app.on('Window-all-closed', () => {
    electron.app.quit();
});

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
    if(windows.downloadsWindow) return;
    windows.downloadsWindow = true;
    let downloadsWindow = new electron.BrowserWindow({
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
});