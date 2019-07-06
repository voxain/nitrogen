$(document).ready(() => {
    const { ipcRenderer }   = require('electron');

    var config      = ipcRenderer.sendSync('getConfig', true);
    var settings    = ipcRenderer.sendSync('getSettings', true);
    
    config.search.searchEngines.forEach(se => {
        let label = document.createElement('option');
        label.value = se.name;
        label.append(document.createTextNode(se.name));
    
        $('#searchEngine').append(label);
        $('#searchEngine').val(settings.search.searchEngine);
    });
    
    $('#searchEngine').on('change', () => {
        ipcRenderer.send('changeSetting', {
            name: ['search', 'searchEngine'],
            value: $('#searchEngine').val()
        });
    });
    
    $('#privateSearchEngine').on('change', () => {
        ipcRenderer.send('changeSetting', {
            name: ['search', 'privateSearchEngine'],
            value: $('#privateSearchEngine').val()
        });
    });

});