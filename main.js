const electron = require('electron');
const vibrancy = require('ewc');
const {ipcMain}= electron;


electron.app.on('ready', () => {
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
    });
});

electron.app.on('Window-all-closed', () => {
    electron.app.quit();
});

ipcMain.on('openSettings', () => {
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
    
    settingsWindow.loadFile('views/systemPages/settings.html');
    
    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    });

    settingsWindow.on('close', () => {
        settingsWindow = null;
    });
});