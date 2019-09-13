$(document).ready(() => {
    const { ipcRenderer } = require('electron');

    let speedChart = echarts.init(document.getElementById('dlspeed'), 'light', {
        renderer: 'canvas',
    });

    function addDownload(filename, id, data){

        let dltime = new Date(data.start);
        let entry = `<div class="listEntry" id="download-::ID::">
            <div class="listEntry-icon">
                <span class="ms-Icon ms-Icon--Document"></span>
            </div>
            <div class="listEntry-middle">
                ::FILENAME:: <span id="download-text-::ID::" style="color: #999; font-size: 11px;">0% - 0B/0B - 0B/s</span><br>
                <div class="progress-outer">
                    <div class="progress-inner" id="download-progress-::ID::" style="width: 0%"></div>
                </div>
            </div>
            <div class="listEntry-icon listEntry-right" onclick="$(this.parentElement).toggleClass('expanded')">
                <span class="ms-Icon ms-Icon--More"></span>
            </div>
            <div class="listEntry-additional">
                <nobr>Download URL: ::URL::</nobr><br>
                Started: ::TIME_START::
            </div>
        </div>`.replace(/::FILENAME::/g, filename).replace(/::ID::/g, id).replace(/::URL::/g, data.url).replace(/::TIME_START::/g, dltime.getHours() + ':' + dltime.getMinutes());

        let listEntry = new DOMParser().parseFromString(entry, 'text/html');
        $('#downloadList').append(listEntry.body.children);
    }

    let downloadSpeed = {};


    ipcRenderer.on('downloadProgress', (e, data) => {
        if(!document.getElementById('download-' + data.dlfile.id)) addDownload(data.dlfile.name, data.dlfile.id, data.dlfile);
        $('#download-progress-' + data.dlfile.id).css('width', data.d.percent * 100 + '%');
        $('#download-text-' + data.dlfile.id).text(`${(data.d.percent * 100).toFixed(2)}% - ${(data.d.size.transferred / 1e+6).toFixed(2)}MB/${(data.d.size.total / 1e+6).toFixed(2)}MB - ${(data.d.speed / 1e+6).toFixed(2)}MB/s - ${Math.round(data.d.time.remaining).toFixed(2)}s remaining`);
        downloadSpeed[data.dlfile.id] = data.d.speed / 1e+6;
    });
    ipcRenderer.on('downloadFinish', (e, data) => {
        $('#download-progress-' + data.dlfile.id).css('width', '100%');
        $('#download-progress-' + data.dlfile.id).css('background', 'green');
        $('#download-text-' + data.dlfile.id).text(`Finished - ${(data.dlfile.size / 1e+6).toFixed(2)}MB`);
        downloadSpeed[data.dlfile.id] = 0;
    });

    function objSum(obj){
        let number = 0;
        Object.values(obj).forEach(v => number+=v);
        return number;
    }

    function randomData() {
        now = new Date(+now + oneDay);
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                objSum(downloadSpeed)
            ]
        };
    }
    
    var data = [];
    var now = +new Date(1997, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    for (var i = 0; i < 60; i++) {
        data.push(randomData());
    }

    speedChart.setOption({
        grid: {
            show: false,
            height: '80%',
            width: '95%',
            top: 20,
            left: 30
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#111']
                }
            }
        },
        series: [{
            smooth: .2,
            smoothMonotone: 'x',
            name: 'Download Speed',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            stack: true,
            areaStyle: 'white',
            data
        }]
    });

    setInterval(function () {

            data.shift();
            data.push(randomData());
    
        speedChart.setOption({
            series: [{
                data: data
            }]
        });
    }, 1000);




    let fileTypes = echarts.init(document.getElementById('filetypes'), 'light', {
        renderer: 'canvas',
    });

    fileTypes.setOption({
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        title: {
            name: 'File Types',
            x: 'center'
        },
        series: [{
            name: 'File Types',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            showSymbol: false,
            data: [
                    {
                        name: '.zip',
                        value: 20
                    },
                    {
                        name: '.png',
                        value: 28
                    },
                    {
                        name: '.exe',
                        value: 23
                    },
                    {
                        name: '.rar',
                        value: 3
                    },
                    {
                        name: '.msi',
                        value: 7
                    },
                    {
                        name: '.mp3',
                        value: 1
                    }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });


    let fileSizes = echarts.init(document.getElementById('filesizes'), 'light', {
        renderer: 'canvas',
    });

    fileSizes.setOption({
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        title: {
            name: 'File Sizes',
            x: 'center'
        },
        series: [{
            name: 'File Sizes',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            showSymbol: false,
            data: [
                    {
                        name: '< 1MB',
                        value: 10
                    },
                    {
                        name: '< 10MB',
                        value: 30
                    },
                    {
                        name: '< 50MB',
                        value: 15
                    },
                    {
                        name: '< 500MB',
                        value: 15
                    },
                    {
                        name: '< 1GB',
                        value: 11
                    },
                    {
                        name: '> 1GB',
                        value: 1
                    }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });


});
