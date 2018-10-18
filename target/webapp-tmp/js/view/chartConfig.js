var BGCOLOR = ["purple", "#0000FF", "#70726F", "#1D5907","#A52A2A","#DC143C","#008B8B","#FF8C00", "#8B0000", "#228B22","#FFD700", "#FF4500","#9ACD32"];

Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            var ctx = chart.chart.ctx;

            //Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
            //Start with a base font of 30px
            ctx.font = "30px " + fontStyle;

            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse+"px " + fontStyle;
            ctx.fillStyle = color;

            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
});


var config = {
    type: 'doughnut',
    data: {
        //	mousemove: abc,
        datasets: [{
            data: [
                1,2,3,4,5
            ],
            "backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"],
            //"hoverBorderColor":["rgb(255, 91, 132)","rgb(54, 62, 235)","rgb(255, 5, 86)"],

            label: 'Today Analysis'
        }],
        labels: [
            'January 100% 00h 00m 00s',
            'Orange',
            'Yellow',
            'Green',
            'Blue'
        ]
    },
    options: {

        responsive: true,
        legend: {
            display: false
        },

        title: {
            display: false,
            text: "Bestie Today's Analysis"
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        events:["mousemove", "mouseout", "click", "touchstart", "touchmove"],

        elements: {
            center: {
                text: '',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Defualt is 20 (as a percentage)
            }
        },
        // events.click: function(e){alert("s")},
        // onHover: function (e,t){
        // 		alert("Event = " + e+" \n Part clicked  - ");
        // }

    }
};



Chart.plugins.register({
    afterDraw: function(chartInstance) {
        if (chartInstance.config.options.showDatapoints) {
            var helpers = Chart.helpers;
            var ctx = chartInstance.chart.ctx;
            var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);

            // render the value of the chart above the bar
            ctx.font = Chart.helpers.fontString("20", 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "black";

            chartInstance.data.datasets.forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                    var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale.maxHeight;
                    //console.log(model.x);
                    var xPos = (scaleMax - model.x) / scaleMax >= -4.5 ? model.x + 40 : model.x - 5;
                    ctx.fillText(getTimeString(""+getTimeSpend(dataset.data[i])), xPos, model.y + 12);
                }
            });
        }
    }
});

var barConfig = {
    type: 'horizontalBar',
    ticks:{
        display:false
    },
    data: {
        labels:['Time'],
        datasets:[{
            label:'Time',
            data:[1]
        }
        ]
    },
    options: {
        showDatapoints: true,
        hover:{
            onHover:function(s){}
        },
        responsive: true,
        intersect: true,
        maintainAspectRatio:false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                stacked:true,
                ticks:{
                    beginAtZero: true,
                    display:false
                }
            }],
            yAxes: [{ stacked: true }]
        }
    }
};
