var hoverF = function (e, v) { // самый ежжи жесткий костыль....
    if (v === undefined){
        return 0;
    } else if (v.length > 0) {
        if (document.querySelector(".vkName") !== null) {
            document.querySelector(".vkName").innerHTML = v[0]._chart.tooltip._data.datasets[0].lineup[v[0]._index] || ''
            document.querySelector("td.date").innerHTML = v[0]._chart.tooltip._data.labels[v[0]._index] || ''
        }
    }
    console.log(e)
}
var clickF = function(e, v) {
    if (v === undefined) {
        return 0;
    } else if (v.length > 0) {
        if (document.getElementById('chartjs-tooltip').style.opacity !== '0') {
            window.open(v[0]._chart.tooltip._data.datasets[0].links[v[0]._index])
        }
    }
}
var tooltipF = function (tooltipModel) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = "<table></table>";
        document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = '<thead>';

        bodyLines.forEach(function (body, i) {
            // innerHtml += '<tr><th class="vkName">' + chart.data.datasets[tooltipModel.dataPoints[i].datasetIndex].model_name + '</th></tr></thead><tbody>';
            innerHtml += '<tr><th class="vkName"> model name </th></tr></thead><tbody>';
            innerHtml += '<tr><td class="date">' + tooltipModel.dataPoints[i].xLabel + '</td></tr>';
            innerHtml += '<tr><td>' + tooltipModel.dataPoints[i].yLabel + '</td></tr>';
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}
// options of charts
var options = {
    onHover: hoverF,
    onClick: clickF,
    title: {
        display: true,
        text: 'Кастомный заголовок',
        fontSize: '16'
    },
    animation: {
        duration: 0,
    },
    elements: {
        point: {
            hitRadius:30
        },
        line: {
            tension: 0,
            fill: false
        },
    },
    tooltips: {
        enabled: false,
        custom: tooltipF
    },
    scales: {
        yAxes: [{
            ticks: {
                callback: function (value, index, values) {
                    return '$' + value;
                }
            }
        }],
        xAxes: [{
            ticks: {
                callback: function (value, index, values) {
                    return value.split(' ')[0];
                }
            }
        }]
    }
}

var dataPreset = {
    labels: [],
    datasets: [{
        label: "NoName pool",
        // backgroundColor: 'rgb(0, 255, 0)',
        // borderColor: 'rgb(0, 255, 0)',
        model_name: 'model name',
        data: [],
        data_ALT: [],
        lineup: []
    }]
}

var preset = {
    type: 'line',
    data: dataPreset,
    options: options
}

//////////////////////////

//////////////////////////

function makeGlobalChart(arr) {
    content.innerHTML += "<div class='chart-container chart-container--main'><canvas class='chart chart-main' width='3' height='1'></canvas></div>";
}

function makeSecondSheets(arr, min, cur) {
    for (let i = 0; i < min.length; i++) {
        content.innerHTML += "<div class='sheet-container__con'><div class='sheet-container__chart'><canvas class='chart chart-second' width='2' height='1'></canvas></div><div class='sheet-container__legend'><div>Cur:<span class='current-price'>" + cur[i][1] + "</span></div><div>Min:<span class='min-price'>" + min[i][1] + "</span></div></div></div>";
    }
}

makeGlobalChart(fullReq)
makeSecondSheets(fullReq, minPrices, currentPrices)


// var cha1rt = new Chart(document.querySelector('.chart-main').getContext('2d'), preset);
// var chart;
var dataLines = [];


for (i = 0; i < GPUReq.length; i++) {
    dataLines.push([[],[],[]])
    for (r = 0; r < fullReq.length; r++) {
        if (fullReq[r][0] === GPUReq[i][0]) {
            dataLines[i][0].push(fullReq[r][3])
            dataLines[i][1].push(fullReq[r][2])
            dataLines[i][2].push(fullReq[r][4])
        }
    }
}

for (i = 0; i < GPUReq.length; i++) {
    tmp = copyObj(preset);
    tmp.options.tooltips.custom = tooltipF
    tmp.options.onHover = hoverF
    tmp.options.onClick = clickF
    tmp.options.scales.xAxes[0].ticks.callback = function (value, index, values) { return value.split(' ')[0]; };
    tmp.options.title.text = GPUReq[i][1];
    tmp2 = copyObj(dataPreset);
    for (r=0; r < fullReq.length; r++) {
        if (fullReq[r][0] === GPUReq[i][0]) {
            tmp2.labels.push(fullReq[r][5])     //dates
            tmp2.datasets[0] = {
                label: fullReq[r][1],           //label
                lineup: dataLines[i][0],        //names
                links: dataLines[i][2],         //links
                data: dataLines[i][1],           //prices
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgb(0, 255, 0)',
            }
        }
    }
    tmp.data = tmp2;
    var chart = new Chart(document.querySelectorAll('.chart-second')[i].getContext('2d'), tmp);
}