$(document).ready(() => {

    const electron = require('electron');
    const {remote, ipcRenderer} = electron;
    

    var config      = ipcRenderer.sendSync('getConfig', true);
    var settings    = ipcRenderer.sendSync('getSettings', true);

    let nitrogen = {
        currentWindow: remote.getCurrentWindow(),
    
        tabBar: {
            addTab: (options) => {
                let newTab = document.createElement('div');
                newTab.classList = 'tab borderRight' + (options.active ? ' active' : '');
                newTab.id = 'tab-' + parseInt(nitrogen.currentTab + 1);
        
                let text = document.createElement('div');
                text.classList = 'tabText';
                text.id = 'tab' + nitrogen.currentTab + 1;
                text.append(document.createTextNode(options.title || 'New Tab'));

                let tabX = document.createElement('div');
                tabX.classList = 'systemButton tabX';
        
                let icon = document.createElement('span');
                icon.classList = 'mdil mdil-chevron-double-down tabX';
        
                let siteIcon = document.createElement('img');
                siteIcon.classList = 'siteIconTab';
        
                newTab.append(siteIcon);
                newTab.append(text);
                tabX.append(icon);
                newTab.append(tabX);
        
                $('.tab').removeClass('active');
                $('#tabContainer').append(newTab);

                nitrogen.currentTab += 1;
                newTab.count = nitrogen.currentTab;

                $(newTab).on('click', e => {
                    if(e.target.classList == 'systemButton tabX') return;
                    nitrogen.tabBar.switchTab(newTab.count);
                });

                let webview = document.createElement('webview');
                webview.classList = 'tabView';
                webview.enableremotemodule = false;
                webview.src = 'newTabPage.html';

                $('.tabView').css('display', 'none');
                webview.style.display = 'inline-flex';
                webview.tab = newTab;

                $('#viewContainer').append(webview);

                let thisTab = {
                    number: newTab.count,
                    tab: newTab,
                    view: webview
                };
                nitrogen.tabs.push(thisTab);

                tabX.onclick = () => {
                    nitrogen.tabs.splice(nitrogen.tabs.indexOf(thisTab), 1);
                    $(newTab).remove();
                    $(webview).remove();
                    if(thisTab.number <= nitrogen.currentTab) nitrogen.currentTab -= 1;
                    $('.tab').attr('id', i => 'tab-' + i);
                    console.log(nitrogen.currentTab);
                    if(thisTab.number == nitrogen.currentTab) nitrogen.tabBar.switchTab(nitrogen.tabs.length - 1);
                };

                $(webview).on('did-fail-load', e => {
                    webview.src = 'errors/' + e.originalEvent.errorCode + '.html';
                    siteIcon.src = '';
                });

                $(webview).on('page-title-updated', e => $(text).text(e.originalEvent.title) );
                $(webview).on('page-favicon-updated', e => siteIcon.src = e.originalEvent.favicons[0] );
                $(webview).on('did-stop-loading', e => siteIcon.src = '' );
                $(webview).on('load-commit', e => {
                    if(!e.originalEvent.isMainFrame) return;
                    siteIcon.src = 'assets/loading.gif';
                    $('#searchBar').val(e.originalEvent.url);
                });
                //$(webview).on('did-navigate', e => siteIcon.src = 'assets/loading.gif' );
            },

            switchTab: number => {
                currentTab = number;

                $('.tab').removeClass('active');
                $('#tab-' + number).addClass('active');

                $('.tab').css('z-index', '1');
                $('#tab-' + number).css('z-index', '5');

                $('.tabView').css('display', 'none');
                $(nitrogen.tabs[number].view).css('display', 'inline-flex');

                $('#searchBar').val(nitrogen.tabs[number].view.src);
            }
        },

        tabs: [],
        currentTab: -1
    };

    function maxUnmax(){
        if(!nitrogen.currentWindow.isMaximized() && nitrogen.currentWindow.isMaximizable()) {
            nitrogen.currentWindow.maximize();
            $('#systemMaxIcon').removeClass('mdil-plus');
            $('#systemMaxIcon').addClass('mdil-minus');
            $(document.body).css('border', 'none');
            return;
        }
        $(document.body).css('border', 'none');
        nitrogen.currentWindow.unmaximize();

        $('#systemMaxIcon').removeClass('mdil-minus');
        $('#systemMaxIcon').addClass('mdil-plus');
    }

    if(settings.general.bookmarksBar) {
        $('#bookmarksBar').css('display', 'block');
        $('.browserWindow').css('height', 'calc(100% - 105px)');
    }

    nitrogen.tabBar.addTab({active: true});

    $('#addTab').on('click', () => nitrogen.tabBar.addTab({active: true}) );
    $('#systemClose').on('click', () => nitrogen.currentWindow.close());
    $('#systemMax').on('click', () => maxUnmax());
    $('#systemMin').on('click', () => nitrogen.currentWindow.minimize());

    $('#searchBar').on('keypress', e => {
        if(e.which == 13){
            if( $('#searchBar').val().startsWith('nitro://') ) nitrogen.tabs[nitrogen.currentTab].view.src = 'systemPages/' + $('#searchBar').val().split('://')[1] + '.html';
            else if ($('#searchBar').val().startsWith('http://') || $('#searchBar').val().startsWith('https://')) nitrogen.tabs[nitrogen.currentTab].view.loadURL( $('#searchBar').val() );
            else if ($('#searchBar').val().split('.')[1] ) nitrogen.tabs[nitrogen.currentTab].view.loadURL( 'https://' + $('#searchBar').val() );
            else nitrogen.tabs[nitrogen.currentTab].view.loadURL( config.search.searchEngines.find(s => s.name == settings.search.searchEngine).url.replace( '::term::', $('#searchBar').val() ) );
        }
    });

    $('#navBack').on('click', () => nitrogen.tabs[nitrogen.currentTab].view.goBack());
    $('#navFwd').on('click', () => nitrogen.tabs[nitrogen.currentTab].view.goForward());
    $('#navRld').on('click', () => nitrogen.tabs[nitrogen.currentTab].view.reload());
    $('#navDev').on('click', () => {
        let view = nitrogen.tabs[nitrogen.currentTab].view;
        if(view.isDevToolsOpened()) return view.closeDevTools();
        view.openDevTools();
    });

    $('#openSettings').on('click', () => electron.ipcRenderer.send('openSettings'));
    $('#downloadManager').on('click', () => electron.ipcRenderer.send('openDownloads'));
});