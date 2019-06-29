const electron = require('electron');
const vibrancy = require('ewc');


electron.app.on('ready', () => {
    let windows = [];

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
        windows.slice(windows.indexOf(mainWindow), 1);
        mainWindow = null;
    });


    windows.push(mainWindow);
});

electron.app.on('Window-all-closed', () => {
    electron.app.quit();
});