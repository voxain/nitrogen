$(document).ready(() => {
    let speedChart = echarts.init(document.getElementById('dlspeed'), 'light', {
        renderer: 'canvas',
    });

    function randomData() {
        now = new Date(+now + oneDay);
        value = 5 + Math.random() * 2;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                value
            ]
        }
    }
    
    var data = [];
    var now = +new Date(1997, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var value = Math.random() * 7;
    for (var i = 0; i < 60; i++) {
        data.push(randomData());
    }

    speedChart.setOption({
        title: {
            name: 'Download Speed'
        },
        grid: {
            show: false,
            height: '80%',
            width: '95%',
            top: 20,
            left: 20
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
                show: false
            }
        },
        series: [{
            smooth: .2,
            smoothMonotone: 'x',
            name: 'Download Speed',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
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
});
