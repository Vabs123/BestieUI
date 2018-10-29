//favicon.ico
var data = [];
var labels = [];
var bColor = [];
var canvas = null;
var ctx = null;
var barCanvas = null;
var barCtx = null;
var barAnalysis = null;
var barData = null;
var todayAnalysis = null;
var todayData = null;
var totalTimeSpend = 0;
var dataTable = null;
var cur = null;
var curRow = null;
var active = null;
var setOfKeys = new Set(['socialSites', 'notificationTime', 'alert', 'customAlert']);
var activeAnalysisHeader = null;
var activeStatsHeader = null;
var barMaxSiteTimeFind = {};
var barTotalTime = 0;
var activeDeafultStats = null;





barConfig.options.hover.onHover = showBarDivResult;



window.onload = function(){

    document.getElementById("analysis_header").addEventListener("click", getTypeOfAnalysis);
    document.getElementById("stats_header").addEventListener("click", getTypeOfStats);
    document.getElementById("select_date").addEventListener("click", getAnalysisForSelectedDay);
    document.getElementById("select_month").addEventListener("click", getStatsForSelectedMonth);
    document.getElementById("select_range").addEventListener("click", getStatsForSelectedRange);
    document.getElementById("update_sites").addEventListener("click", showSocialSitesDiv);
    document.getElementById("update_alert_time").addEventListener("click", showAlertDiv);
    document.getElementById("site_used").addEventListener("click", removeSite);
    document.getElementById("add_sitename").addEventListener("click", addSite);
    document.getElementById("set_alert_time").addEventListener("click", updateAlertTime);
    document.getElementById("cover").addEventListener("click", hideHoveringDiv);
	document.getElementById("custom_alert_time").addEventListener("click", customAlert);
    document.getElementById("basic_alert_time").addEventListener("click", basicAlert);
	initiallize();
}



function initiallize(){

	var x = document.querySelectorAll("#close");
	for(var close of x)setCloseListener(close);

	activeAnalysisHeader = document.getElementById("today");
	canvas = document.getElementById("chart-area");
	ctx = canvas.getContext("2d");
	todayAnalysis = new Chart(ctx, config);
	todayData = todayAnalysis.chart.config.data;
	dataTable = document.getElementById("data_table");


	barCanvas = document.getElementById('bar-chart-area');
	barCtx = barCanvas.getContext("2d");
	barAnalysis = new Chart(barCtx, barConfig);
	barData = barAnalysis.chart.config.data;



	activeStatsHeader = document.getElementById("default_ranges");
	document.getElementById("default_list").addEventListener("click",getDefaultRangeOption);
	activeDeafultStats = document.getElementById("cur_week");

	document.getElementById("about_us").addEventListener("click", aboutUs);
	setListenersToTable();
	//setBarChartListeners();
	var curDate = new Date();
	showChart(curDate);
	setDoughnutListeners();
	//showStats(curDate.getMonth(), null);
    document.getElementById("default_ranges").innerText = "Current Week Stats";
	//getCurrentWeekStats();

	check();
}



function customAlert(){
    fetchKey(["customAlert","socialSites"]).then((result) => {showCustomAlertDiv(result["customAlert"], result["socialSites"]);});
}


function basicAlert(){
    fetchKey("notificationTime").then((result) => {showBasicAlertDiv(result.notificationTime);});
}

function showAlertDiv(){
	fetchKey("alert").then((result) => {
		if(result["alert"] === "basic")
			basicAlert();
		else
			customAlert();
	});
}

function showCustomAlertDiv(customAlert, socialSites){
	var setter = "";
	var time = {hour:0, min:30};
	var i = 0;
	for(var site of socialSites){
		setter += '<label>'+site+'</label><br><input type="range" min="0" max="23" value="1" class="slider" id = "hour'+i+'">'+
            '   <span id="hour_value'+i+'"></span> hours'+
            '   <input type="range" min="1" max="60" value="45" class="slider" id = "min'+i+'">'+
            '  <span id="min_value'+i+'"></span> mins';

		i++;
	}
	document.getElementById("custom_alert_time").style.display = "none";
    document.getElementById("basic_alert_time").style.display = "block";



    var alertTime = document.getElementById("hover_notification_div");
    document.getElementById("cover").style.display = "block";
	alertTime.style.display = "block";
    alertTime.style.left = "20%";
    alertTime.style.width = "60%";

    var alertDiv = document.getElementById("alert");
    alertDiv.innerHTML = setter;
    alertDiv.style.height = "400px";

    for(i = 0; i < socialSites.length; i++){
        if(!customAlert.hasOwnProperty(socialSites[i]))
            time = {hour:0, min:30};
        else
        	time = customAlert[socialSites[i]];

        var hourSlider = document.getElementById("hour"+i);
        hourSlider.value = time.hour;
        var minSlider = document.getElementById("min"+i);
        minSlider.value = time.min;
        var hourOutput = document.getElementById("hour_value"+i);
        var minOutput = document.getElementById("min_value"+i);
        hourOutput.innerHTML = hourSlider.value;
        minOutput.innerHTML = minSlider.value;
        hourSlider.oninput = function() {
        	var id = this.id.replace(/[^0-9]/g, "");
            document.getElementById("hour_value"+id).innerHTML = this.value;
        }
        minSlider.oninput = function () {
            var id = this.id.replace(/[^0-9]/g, "");
            document.getElementById("min_value"+id).innerHTML = this.value;
        }
	}
}

function showBasicAlertDiv(time){
    var timeParts = time.split(":");
    var hours = timeParts[0];
    var mins = timeParts[1];

    document.getElementById("custom_alert_time").style.display = "block";
    document.getElementById("basic_alert_time").style.display = "none";

    document.getElementById("hover_notification_div").style.display = "block";
    document.getElementById("cover").style.display = "block";

    var alertDiv = document.getElementById("alert");
    alertDiv.innerHTML = "";
	alertDiv.style.height = "170px";
    var setter = '<input type="range" min="0" max="23" value="1" class="slider" id = "hour">'+
        '   <span id="hour_value"></span> hours'+
        '   <input type="range" min="1" max="60" value="45" class="slider" id = "min">'+
        '  <span id="min_value"></span> mins';
	alertDiv.innerHTML = setter;

    var hourSlider = document.getElementById("hour");
    hourSlider.value = hours;
    var minSlider = document.getElementById("min");
    minSlider.value = mins;
    var hourOutput = document.getElementById("hour_value");
    var minOutput = document.getElementById("min_value");
    hourOutput.innerHTML = hourSlider.value;
    minOutput.innerHTML = minSlider.value;
    hourSlider.oninput = function() {
        hourOutput.innerHTML = this.value;
    }
    minSlider.oninput = function () {
        minOutput.innerText = this.value;
    }
}


function updateAlertTime(){

    if(document.getElementById("basic_alert_time").style.display === "none"){
        var hour = document.getElementById("hour_value").innerText;
        var min = document.getElementById("min_value").innerText;
        setBasicAlertTime(hour, min);
	}
	else{
        fetchKey(["socialSites"]).then((result) => {
            var customAlert = {};
        	var  i = 0;
        	for(var site of result["socialSites"]){
            	var hour = document.getElementById("hour_value"+i).innerText;
            	var min = document.getElementById("min_value"+i).innerText;
            	customAlert[site] = {hour:hour,min:min};
            	i++;
        	}
        	setCustomAlertTime(customAlert);
        });
	}
}


// async function changeAlertTime(e) {
//     var result = await fetchKey("notificationTime");
//     var time = result.notificationTime;
//     var timeParts = time.split(":");
//     var hours = timeParts[0];
//     var mins = timeParts[1];
//     document.getElementById("hover_notification_div").style.display = "block";
//     document.getElementById("cover").style.display = "block";
//     var hourSlider = document.getElementById("hour");
//     hourSlider.value = hours;
//     var minSlider = document.getElementById("min");
//     minSlider.value = mins;
//     var hourOutput = document.getElementById("hour_value");
//     var minOutput = document.getElementById("min_value");
//     hourOutput.innerHTML = hourSlider.value;
//     minOutput.innerHTML = minSlider.value;
//     hourSlider.oninput = function() {
//         hourOutput.innerHTML = this.value;
//     }
//     minSlider.oninput = function () {
//         minOutput.innerText = this.value;
//     }
// }

function setBasicAlertTime(hours, mins){
    var time = hours+":"+mins;
    // chrome.storage.sync.set({notificationTime: time}, function(){
    // 	//show mark
    // });
    updateKey({notificationTime:time, alert : "basic"});
}

function setCustomAlertTime(customAlert){
	updateKey({customAlert:customAlert, alert:"custom"});
}



async function check(){
   // await new Promise((resolve, reject) => {setTimeout(() => resolve("done!"), 5000)});
   //  var curDate = new Date("2017","04","06");
   //  showChart(curDate);
   //  activeAnalysisHeader.style.color = "grey";
   //  activeAnalysisHeader = document.getElementById("today");
   //  activeAnalysisHeader.style.color = "black";
   //  getCurrentWeekStats();
   //  document.getElementById("default_ranges").innerText = "Current Week Stats";
   //  activeDeafultStats.style.color = "grey";
   //  activeDeafultStats = document.getElementById("cur_week");
   //  activeDeafultStats.style.color = "black";
}


function setCloseListener(x){
	x.addEventListener("click",close);
}

function close(e){
	e.path[2].style.display = "none";
	document.getElementById("cover").style.display = "none";
}

function hideHoveringDiv(e){
    document.getElementById("hover_options").style.display = "none";
    document.getElementById("hover_notification_div").style.display = "none";
    document.getElementById("cover").style.display = "none";
}

async function showSocialSitesDiv(e) {
	var result = await fetchKey("socialSites");
	showSites(result.socialSites);
}

function showSites(socialSites) {
	document.getElementById("hover_options").style.display = "block";
    document.getElementById("cover").style.display = "block";
	var well = document.getElementById('site_used');
	well.innerHTML = "";
	var i = 0;
	for(var site of socialSites){
		var button = document.createElement('button');
		button.className = 'btn';
		var span = document.createElement('span');
		span.innerHTML = site+" <i class=\"fa fa-times fa-lg\" aria-hidden=\"true\" style=\"margin-left: 5px; color: #a2a1a1\" id="+i+" ></i>";
		//button.textContent=site;
		span.id = i;
		//span.className = "btn";
		button.appendChild(span);
		button.id = i++;
		well.appendChild(button);
	}
}





async function updateSocialSites(socialSiteList){
			var l = await updateKey({socialSites:socialSiteList});
           var curDate = new Date();
           showChart(curDate);
           activeAnalysisHeader.style.color = "grey";
           activeAnalysisHeader = document.getElementById("today");
           activeAnalysisHeader.style.color = "black";
           getCurrentWeekStats();
           document.getElementById("default_ranges").innerText = "Current Week Stats";
           activeDeafultStats.style.color = "grey";
           activeDeafultStats = document.getElementById("cur_week");
           activeDeafultStats.style.color = "black";
           fetchKey("customAlert").then((result) => {

           		for (var site of socialSiteList){
           			if(!result.customAlert.hasOwnProperty(site))
           					result.customAlert[site] = {hour:0, min:30};
				}
				updateKey(result);
		   });
}



async function removeSite(e){
	if(e.target.className === "btn" || e.target.parentNode.parentNode.className === "btn" || e.target.parentNode.className === "btn"){
        var result = await fetchKey("socialSites");
        var socialSites = result.socialSites;
		socialSites.splice(e.target.id, 1);
        showSites(socialSites);
		updateSocialSites(socialSites);
	}
}

async function addSite(e) {
	var siteInput = document.getElementById("social_site_name");
	var site = siteInput.value;
	siteInput.value = "";
    var result = await fetchKey("socialSites");
    var socialSites = result.socialSites;
	socialSites.push(site);
	showSites(socialSites);
	updateSocialSites(socialSites);
}


// function getAlertTime(resolve, reject){
//     chrome.storage.sync.get(['notificationTime'], function (result) {
// 		resolve(result['notificationTime']);
//     });
// }




// function createAlertProgressBar(){
//
// }



function getDefaultRangeOption(e){
    barMaxSiteTimeFind = {};
	if(e.target.id === "prev_week"){
		activeDeafultStats.style.color = "grey";
		activeDeafultStats = e.target;
		activeDeafultStats.style.color = "black";
		getPreviousWeekStats();
	}
	else if(e.target.id === "prev_month"){
		activeDeafultStats.style.color = "grey";
		activeDeafultStats = e.target;
		activeDeafultStats.style.color = "black";
		getPreviousMonthsStats(1);
	}
	else if(e.target.id === "three_month"){
		activeDeafultStats.style.color = "grey";
		activeDeafultStats = e.target;
		activeDeafultStats.style.color = "black";
		getPreviousMonthsStats(3);
	}
	else if(e.target.id === "six_month"){
		activeDeafultStats.style.color = "grey";
		activeDeafultStats = e.target;
		activeDeafultStats.style.color = "black";
		getPreviousMonthsStats(6);
	}
    else if(e.target.id === "cur_week"){
        activeDeafultStats.style.color = "grey";
        activeDeafultStats = e.target;
        activeDeafultStats.style.color = "black";
        getCurrentWeekStats();
    }
    else if(e.target.id === "cur_month"){
        activeDeafultStats.style.color = "grey";
        activeDeafultStats = e.target;
        activeDeafultStats.style.color = "black";
        getCurrentMonthStats();
    }
	document.getElementById("default_ranges").innerText = e.target.outerText;


}

function getTypeOfStats(e){
	if(e.target.id === "month_header"){
		activeStatsHeader.style.color = "grey";
		activeStatsHeader = e.target;
		activeStatsHeader.style.color = "black";
		document.getElementById("custompick").style.display="none";
		document.getElementById("monthpick").style.display = "inline-block";


	}
	else if(e.target.id === "custom_range"){
		activeStatsHeader.style.color = "grey";
		activeStatsHeader = e.target;
		activeStatsHeader.style.color = "black";
		document.getElementById("custompick").style.display="block";
		document.getElementById("monthpick").style.display = "none";
	}
}


function showStats(date1, date2){

	fetchStatsData(new Date("2018","09","08"), new Date("2018","09","10"));
}

//2018912
function fetchStatsData(date1, date2){
	var dateTemp = new Date(date1);
	var totalSocialTime = 0;
	var barDataset = {
		totalTime:[]
	}
	var labelsOfBarChart = [];
	var onlineTime = 0;
	fetchKey(null).then(function(result){
		var sites = result["socialSites"];
		for(var site of sites){
			barDataset[site] = [];
		}
		var d = date1;
		while(d <= date2){
			var totalTime = 0;
			var key = getKey(d);
			if(result.hasOwnProperty(key)){
				for(var site in result[key]["summary"]){
					if(barDataset.hasOwnProperty(site)){
						var time = (+result[key]["summary"][site]);
						barDataset[site].push(time);
						totalTime += time;
						totalSocialTime += time;
					}
				}
				barDataset["totalTime"].push(totalTime);
				onlineTime += result[key]["totalTime"];
			}
			else{
				for(var site in barDataset)
					barDataset[site].push(0);
			}
			labelsOfBarChart.push(d.toDateString());
			d.setDate(d.getDate() + 1);
		}
		//showBarChartStacked(barDataset, labelsOfBarChart); Call when stacked
		calculateTotalTimeSpendPercent(totalSocialTime, onlineTime);
		showBarChartUnstacked(barDataset, dateTemp);

	});
}


// function setBarChartListeners(){
// 	var barChartDiv = document.getElementById("barChart_result");
// 	barCanvas.onmousemove =function(e){


// 	var activePoints = barAnalysis.getElementsAtEvent(e);
// 	if (activePoints[0]) {
// 				barChartDiv.style.visibility = "visible";
// 			//	console.log(JSON.stringify(activePoints[0]));
//         		var chartData = activePoints[0]['_chart'].config.data;
//         		console.log(chartData);
//         		var idx = activePoints[0]['_index'];

//         		var label = chartData.labels[idx];
//         		var value = chartData.datasets[0].data[idx];
//         		document.getElementById("site_name").textContent = label;
//         		var per = (+value) / barTotalTime * 100;
//         		per = per.toFixed(2);
//         		document.getElementById("percentage").textContent = per+"%";
//         		document.getElementById("time_spend").textContent = getTimeString(""+getTimeSpend(+value));
//         		document.getElementById("most_active_site_day").textContent = barMaxSiteTimeFind[label][2]+"  (Time Spent - "+getTimeString(""+getTimeSpend(barMaxSiteTimeFind[label][0]))+")";
//         		document.getElementById("most_inactive_site_day").textContent = barMaxSiteTimeFind[label][3]+"  (Time Spent - "+getTimeString(""+getTimeSpend(barMaxSiteTimeFind[label][1]))+")";
//         		//todayAnalysis.options.elements.center.color = chartData.datasets[0].backgroundColor[idx];

//       		}
// };


// barCanvas.onmouseout =function(e){
// 	barChartDiv.style.visibility = "hidden";


// };
// }



function showBarDivResult(e, t){
	//console.log("hello");
	 var barChartDiv = document.getElementById("barChart_result");
	// var activePoints = barAnalysis.getElementsAtEvent(e);
	console.log(e);
	console.log(e.length);
	if (e[0]) {
		//alert("hello");
		barChartDiv.style.visibility = "visible";
		barChartDiv.scrollIntoView(true);
			//	console.log(JSON.stringify(activePoints[0]));
			var chartData = e[0]['_chart'].config.data;
			console.log(chartData);
			var idx = e[0]['_index'];

			var label = chartData.labels[idx];
			var value = chartData.datasets[0].data[idx];
			document.getElementById("site_name").textContent = label;
			var per = (+value) / barTotalTime * 100;
			per = per.toFixed(2);
			document.getElementById("percentage").textContent = per+"%";
			document.getElementById("time_spend").textContent = getTimeString(""+getTimeSpend(+value));
			document.getElementById("most_active_site_day").textContent = barMaxSiteTimeFind[label][2]+"  (Time Spent - "+getTimeString(""+getTimeSpend(barMaxSiteTimeFind[label][0]))+")";
			document.getElementById("most_inactive_site_day").textContent = barMaxSiteTimeFind[label][3]+"  (Time Spent - "+getTimeString(""+getTimeSpend(barMaxSiteTimeFind[label][1]))+")";
        		//todayAnalysis.options.elements.center.color = chartData.datasets[0].backgroundColor[idx];

        	}
        	else{
        		barChartDiv.style.visibility = "hidden";

        	}
        }



function checkMaxSite(barDataset, site, time, date, i){
	if(!barMaxSiteTimeFind.hasOwnProperty(site)){
		barMaxSiteTimeFind[site] = [0,Infinity,"d1","d2"];
	}
	if(time > barMaxSiteTimeFind[site][0]){
		barMaxSiteTimeFind[site][0] = time;
		var tDay = new Date(date);
		tDay.setDate(date.getDate() + i);
		barMaxSiteTimeFind[site][2] = tDay.toDateString();
	}
	if(time < barMaxSiteTimeFind[site][1]){
		barMaxSiteTimeFind[site][1] = time;
		var tDay = new Date(date);
		tDay.setDate(date.getDate() + i);
		barMaxSiteTimeFind[site][3] = tDay.toDateString();
	}

}


function showBarChartUnstacked(barDataset, date1 ){
    barMaxSiteTimeFind = {};
	barAnalysis.options.scales.xAxes[0].stacked = false;
    barAnalysis.update();
    barAnalysis.render();
	var sumBarDataset = {};
	var totalTime = 0;
	var d = [];
	var labels = [];
	var i = 0;
	var mostActiveDay = 0;
	var mostInactiveDay = 0;
	var maxUsedSite = 0;
	var maxSiteName = "";

	//barMaxSiteTimeFind
	//var mostActiveDayOnSite
	bColor = [];
	for(var site in barDataset){
		d[i] = 0;
		if(site != "totalTime"){
			labels.push(site);
			bColor.push(BGCOLOR[i]);
		}
		else
			i--;
		var k = 0;
		var j = 0;
		for(var e of barDataset[site]){
			if(site === "totalTime"){
				totalTime += (+e);
				if(e >  barDataset["totalTime"][mostActiveDay])
					mostActiveDay = k;
				if(e < barDataset[site][mostInactiveDay])
					mostInactiveDay = k;
				k++;
			}
			else{
				checkMaxSite(barDataset, site, e, date1, j++);
				d[i] += (+e);
			}
		}
		if(d[i] > maxUsedSite){
			maxUsedSite = d[i];
			maxSiteName = site;
		}
		i++;
	}
	barData.datasets[0].data = d;
	barTotalTime = totalTime;
	barData.labels = labels;
	barData.datasets[0].backgroundColor = bColor;
	barAnalysis.update();
	barAnalysis.render();


	var mat = getTimeString(""+getTimeSpend(barDataset["totalTime"][mostActiveDay]));
	var mit = getTimeString(""+getTimeSpend(barDataset["totalTime"][mostInactiveDay]));
	var timeParts = mat.split(",");

	var tDay = new Date(date1);
	tDay.setDate(date1.getDate() + mostActiveDay);
	document.getElementById("most_active_day").textContent = tDay.toDateString()+"  (Time Spent - "+mat+")";


	var tDay2 = new Date(date1);
	tDay2.setDate(date1.getDate() + mostInactiveDay);
	document.getElementById("most_inactive_day").textContent = tDay2.toDateString()+"  (Time Spent - "+mit+" )";

	document.getElementById("most_used_site").textContent = maxSiteName+"  (Time Spent - "+getTimeString(""+getTimeSpend(maxUsedSite))+" )";
	document.getElementById("total_time_spend").textContent = getTimeString(""+getTimeSpend(totalTime));
	//var
}



//todayData.datasets[0].data = data;
function showBarChartStacked(barDataset, labelsOfBarChart){
	var dataOfBarChart = [];
	var i = 0;
	for(var key in barDataset)
		if(key != "totalTime")
		dataOfBarChart.push({label:key,data:barDataset[key], backgroundColor:BGCOLOR[i++]});

	barData.datasets = dataOfBarChart;
	barData.labels = labelsOfBarChart;
	document.getElementById("bar-canvas-holder").style.height = 80*labelsOfBarChart.length+"px";

	barAnalysis.update();

	barAnalysis.render();


}

function getKey(date){
	var key = ""+date.getFullYear()+date.getMonth()+date.getDate();
//	console.log("Key to be searched = ", key);
	return key;
}

function getCurrentWeekStats(){
	var date1 = new Date();
	var date2 = new Date();
	date1.setDate(date1.getDate() - date1.getDay());
    fetchStatsData(date1, date2);
    var time = document.getElementById("time_range");
    var timeSite = document.getElementById("time_range_site");
    time.textContent = date1.toDateString() + " - "+ date2.toDateString();
    timeSite.textContent = date1.toDateString() + " - "+ date2.toDateString();
}

function getCurrentMonthStats(){
    var date1 = new Date();
    var date2 = new Date();
    date1.setDate(1);
    fetchStatsData(date1, date2);
    var time = document.getElementById("time_range");
    var timeSite = document.getElementById("time_range_site");
    time.textContent = date1.toDateString() + " - "+ date2.toDateString();
    timeSite.textContent = date1.toDateString() + " - "+ date2.toDateString();
}


function getPreviousWeekStats(){
	var date2 = new Date();
	var date1 = new Date();
	date1.setDate(date2.getDate() - (date2.getDay()+7));
	date2.setDate(date2.getDate() - date2.getDay() - 1);

	console.log(date1+" "+date2);
	fetchStatsData(date1, date2);
	var time = document.getElementById("time_range");
	var timeSite = document.getElementById("time_range_site");
	time.textContent = date1.toDateString() + " - "+ date2.toDateString();
	timeSite.textContent = date1.toDateString() + " - "+ date2.toDateString();
}

function getPreviousMonthsStats(noOfMonths){
	var date1 = new Date();
	date1.setMonth(date1.getMonth() - noOfMonths);
	date1.setDate(1);
	var date2 = new Date();
	date2.setDate(0);
	console.log(date1+" "+date2);
	fetchStatsData(date1, date2);
	var time = document.getElementById("time_range");
	var timeSite = document.getElementById("time_range_site");
	time.textContent = date1.toDateString() + " - "+ date2.toDateString();
	timeSite.textContent = date1.toDateString() + " - "+ date2.toDateString();
}


function getStatsForSelectedMonth(){
	var selectedMonthYear = document.getElementById("month");
	var timeparts = selectedMonthYear.value.split("-");
	var date1 = new Date(timeparts[0],+timeparts[1]-1,"1");
	var date2 = new Date(timeparts[0],timeparts[1],"0");
	fetchStatsData(date1, date2);
}

function getStatsForSelectedRange(){
	var day1 = document.getElementById("custom_date1");
	var day2 = document.getElementById("custom_date2");
	var timeparts1 = day1.value.split("-");
	var timeparts2 = day2.value.split("-");
	fetchStatsData(new Date(timeparts1[0],+timeparts1[1]-1,timeparts1[2]), new Date(timeparts2[0],+timeparts2[1]-1,timeparts2[2]));
}

function getAnalysisForSelectedDay(){
	var datePicker = document.getElementById("date_selector").value;
	showChart(new Date(datePicker));
}

function getTypeOfAnalysis(e){
	//alert(e.target.id);
	if(e.target.id != "analysis_header" && e.target.id != "stats"){
		var datePickerDiv = document.getElementById("datepick");
		datePickerDiv.style.visibility="hidden";
		activeAnalysisHeader.style.color = "grey";
		activeAnalysisHeader = e.target;

	}
	if(activeAnalysisHeader.id === "today"){
		document.getElementById("analysis_type").innerText = "Today";
		activeAnalysisHeader.style.color = "black";
		showChart(new Date());

	}
	else if(activeAnalysisHeader.id === "select_day"){
		activeAnalysisHeader.style.color = "black";
		datePickerDiv.style.visibility="visible";


		//var date = document.getElementById("date_selector").value;
		//showChart(new Date(date));
	}
	else if(activeAnalysisHeader.id === "all_time"){
        document.getElementById("analysis_type").innerText = "All Time";
		activeAnalysisHeader.style.color = "black";
		showChart(null);
	}
	if(e.target.id === "stats"){
        activeDeafultStats.style.color = "grey";
        activeDeafultStats = document.getElementById("cur_week");
        activeDeafultStats.style.color = "black";
        getCurrentWeekStats();
		document.getElementById("statistics").style.display = "block";
        document.getElementById("default_ranges").innerText = activeDeafultStats.innerText;
	}


}



async function showChart(date){
    var result = await fetchKey("socialSites");
    var socialSites = result.socialSites;


	data = [];
	totalTimeSpend = 0;
	bColor = [];
	labels = [];
	var today = date;
	dataTable.innerHTML="";
//	dataTable.style.visibility = "hidden";
	var key = null;
	if(date != null)
		key = ""+today.getFullYear()+today.getMonth()+today.getDate();
	fetchKey(key).then(function(result){
		console.log(result[key]);
		if(result[key]) {
            var summary = result[key]["summary"];
            var i = 0;
            for (var site of socialSites) {
                if (summary.hasOwnProperty(site)) {
                    data.push(((+summary[site])));
                    totalTimeSpend += (+summary[site]);
                    console.log("Total Time Spend Today = " + totalTimeSpend);
                    //labels.push(site);

                }
                else {
                    data.push(0);
                }
                bColor.push(BGCOLOR[i++]);
            }
                todayData.datasets[0].backgroundColor = bColor;
                todayData.datasets[0].data = data;

                createTable(result[key]["summary"], socialSites);
                todayData.labels = labels;
            calculateTotalTimeSpendPercent(totalTimeSpend, "today");

        }
		else if(date === null){
			var tt = 0;
			var totalSummary = {};
			for(var k in result){
				if(setOfKeys.has(k))
					continue;
				var summary = result[k]["summary"];
				for(var site of socialSites){
					if(!totalSummary.hasOwnProperty(site))
						totalSummary[site] = 0;
					if(summary.hasOwnProperty(site))
					totalSummary[site] += summary[site];
				}
			}
			var i = 0;
			for(var site in totalSummary){
				data.push(((+totalSummary[site])));
				totalTimeSpend += (+totalSummary[site]);
				console.log("Total Time Spend Today = " + totalTimeSpend);
				//labels.push(site);
				tt = totalTimeSpend;
				bColor.push(BGCOLOR[i++]);
			}
			todayData.datasets[0].backgroundColor = bColor;
			todayData.datasets[0].data = data;

			createTable(totalSummary, socialSites);
			todayData.labels = labels;
            calculateTotalTimeSpendPercent(totalTimeSpend, "allTime");
		}
		else{
			todayData.labels = ['No Data'];
			todayData.datasets[0].data = ['1'];
		}
        document.getElementById("time_spent").innerText = getTimeString(""+getTimeSpend(totalTimeSpend));

	//	setTotalTime(totalTimeSpend);
			todayAnalysis.update();
			todayAnalysis.render();

	});
}

function calculateTotalTimeSpendPercent(socialTime, timespan){

	if(timespan === "today"){
		var key = getKey(new Date());
		fetchKey(key).then(
			function (result) {
				var totalTime = (~~result[key]["totalTime"])*1000;
				var per =  (socialTime/totalTime*100).toFixed();
				if(!per)
					per = 0;
                document.getElementById("percent_time_spent").innerText = per+"%";
                document.getElementById("online_time").innerText = "spent today : "+getTimeString(""+getTimeSpend(totalTime));
            }
		);
	}
	else if(timespan === "allTime"){
		fetchKey(null).then((result)=>{
			var totalTime = 0;
			for(var key in result){
				if(setOfKeys.has(key))
					continue;
				totalTime += ~~result[key]["totalTime"];
			}
			totalTime *= 1000;
        var per =  (socialTime/totalTime*100).toFixed();

        if(!per)
        	per = 0;
        document.getElementById("percent_time_spent").innerText = per+"%";
        document.getElementById("online_time").innerText = "spent all time : "+getTimeString(""+getTimeSpend(totalTime));
		});
	}
	else if(!isNaN(timespan)){
		timespan *= 1000;
        var per =  (socialTime/timespan*100).toFixed();
        if(!per)
        	per = 0;
        document.getElementById("percent_time_spend").innerText = per+"%";
        document.getElementById("total_time_spend_online").innerText = getTimeString(""+getTimeSpend(timespan));

	}
}
//
// function setTotalTime(totalTimeSpend){
// 	var time = ""+getTimeSpend(totalTimeSpend);
// 	var formattedTime = "";
// 	var timeparts = time.split(",");
//     if(timeparts.length === 3){
//         formattedTime = timeparts[0]+":"+timeparts[1]+":"+timeparts[2];
//     }
//     else if(timeparts.length === 2){
//         formattedTime = "00:"+timeparts[0]+":"+timeparts[1];
//     }
//     else if(timeparts.length === 1){
//         formattedTime = "00:00:"+timeparts[0];
//     }
//     document.getElementById("time_spent").innerText = formattedTime;
// }


function setListenersToTable(){
dataTable.addEventListener("mouseover", function(e){
	console.log(e.target);
    console.log(e);
	var rowHovered = e.target.parentElement;
	if(e.target.parentElement.id === "l")
		rowHovered = e.target.parentElement.parentElement;
	var body = document.querySelector("body")
	// console.log("Selected= "+body);
	// console.log("Hovered row = "+rowHovered);
	// console.log("Hovered row = "+rowHovered.id);

	if(rowHovered != body && rowHovered.id != "table_head" ){
		console.log(e);
		rowHovered.style.color = "black";
		cur = todayAnalysis.getDatasetMeta(0).data[rowHovered.id];
		todayAnalysis.updateHoverStyle([cur], null, true);

// render so we can see it
		todayAnalysis.render();
		var d = todayAnalysis.chart.config.data.datasets[0];
		todayAnalysis.options.elements.center.text = todayData.labels[rowHovered.id];
		//data.borderColor = "black";
		todayAnalysis.options.elements.center.color = d.backgroundColor[rowHovered.id];
	}
});

dataTable.addEventListener("mouseout", function(e){
	var rowHovered = e.target.parentElement;
	console.log(rowHovered);
	//console.log(e);
	rowHovered.style.color = "grey";


	todayAnalysis.updateHoverStyle([cur], null, false);

// render so we can see it
	todayAnalysis.render();
	todayAnalysis.options.elements.center.text = "";

});
}

function setDoughnutListeners(){
	canvas.onmousemove =function(e){
	var activePoints = todayAnalysis.getElementsAtEvent(e);
	if (activePoints[0]) {
			//	console.log(JSON.stringify(activePoints[0]));
        		var chartData = activePoints[0]['_chart'].config.data;
        		console.log(chartData);
        		var idx = activePoints[0]['_index'];

        		var label = chartData.labels[idx];
        		var value = chartData.datasets[0].data[idx];
        		todayAnalysis.options.elements.center.text = todayData.labels[idx];;
        		todayAnalysis.options.elements.center.color = chartData.datasets[0].backgroundColor[idx];
        		if(curRow != null)
        			curRow.style.color = "grey";
        		curRow = document.getElementById(idx);

        		curRow.style.color = "black";
        	//	chartData.datasets[0].
        		// var url = "http://example.com/?label=" + label + "&value=" + value;
        		// console.log(url);
        		// alert(url);
      		}
};

canvas.onmouseout =function(e){

    todayAnalysis.options.elements.center.text = "";
    curRow.style.color = "grey";


};
}






function createTable(result, socialSites){
	var i = 0;
	var res = {};
	for (var key of socialSites){
		if(result.hasOwnProperty(key))
    		res[key] = result[key];
		else
			res[key] = 0;
		dataTable.appendChild(createRow(res, key, i));
		i++;
	}
}

function createRow(result, key, id){
	var time = ""+getTimeSpend(result[key]);
	var per = result[key] / totalTimeSpend * 100;
	if(!per)
		per = 0;
	per = per.toFixed(2);
	labels.push(key + " " + per+"%");
	var timeParts = time.split(",");
	var hours = "00";
	var mins = "00";
	var secs = "00";
	if(timeParts.length === 3){
		hours = timeParts[0];
		mins = timeParts[1];
		secs = timeParts[2];
	//	labels.push(key + " " + per+"% "+hour+"h "+mins+"m "+secs+"s");
	}
	else if(timeParts.length === 2){
		mins = timeParts[0];
		secs = timeParts[1];
	//	labels.push(key + " " + per+"% "+mins+"m "+secs+"s");
	}
	else if(timeParts.length === 1){
		secs = timeParts[0];
	//	labels.push(key + " " + per+"% "+secs+"s");
	}
	if(secs.length == 1)
		secs = "0"+secs;
	if(mins.length == 1)
		mins = "0"+mins;
	if(hours.length == 1)
		hours = "0"+hours;

	console.log(timeParts.length);
	console.log(timeParts);
	console.log(typeof secs);

	var row = document.createElement('TR');
	row.id = id;
	var s = document.createElement('span');
	s.className = "badge";
	s.textContent = ".";
	s.style.color = BGCOLOR[id];
	s.style.backgroundColor=BGCOLOR[id];
	var label = document.createElement('TD');
	label.id = "l";

    // var s = document.createElement("IMG");
    // s.setAttribute("src", "");

	label.appendChild(s);

	var domain = document.createElement('TD');
	domain.textContent = key;
	domain.style.textAlign = "left";
	var empty1 = document.createElement('TD');
	empty1.textContent = "sssssssss";
	empty1.style.color="#fff";
	var empty2 = document.createElement('TD');
	empty2.textContent = "sss";
	empty2.style.color="#fff";
    var empty3 = document.createElement('TD');
    empty3.textContent = "s";
    empty3.style.color="#fff";

    var percentage = document.createElement('TD');
	percentage.textContent = per;

	var percentageMark = document.createElement('TD');
	percentageMark.textContent = "%";
	var hour = document.createElement('TD');
	hour.textContent = hours;

	var hMark = document.createElement('TD');
	hMark.textContent = "h";
	if(hours != "00"){
		hour.style.color = "black";
		hMark.style.color = "black";
	}
	var min = document.createElement('TD');
	min.textContent = mins;
	var mMark = document.createElement('TD');
	mMark.textContent = "m";
	if(mins != "00"){
		min.style.color = "black";
		mMark.style.color = "black";
	}
	var sec = document.createElement('TD');
	sec.textContent = secs;
	var sMark = document.createElement('TD');
	sMark.textContent = "s";
	if(secs != "00"){
		sec.style.color = "black";
		sMark.style.color = "black";
	}

	row.appendChild(label);
	row.appendChild(empty3);
	row.appendChild(domain);
	row.appendChild(empty1);
	row.appendChild(percentage);
	row.appendChild(percentageMark);
	row.appendChild(empty2);
	if(hours != "00") {
        row.appendChild(hour);
        row.appendChild(hMark);
    }
    if(mins != "00") {
        row.appendChild(min);
        row.appendChild(mMark);
    }
	row.appendChild(sec);
	row.appendChild(sMark);

	return row;
}


// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, function(tab){
//      console.log( "From tabs changed -- "+ tab.url);
//      if(tab.url === "chrome://newtab/"){
//      	//	alert("updated");
//      	document.location.reload();
//      }
//   });
// });


 function aboutUs(){
 //	chrome.tabs.create({"url":chrome.runtime.getURL("analytics.html")});
 }

 function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
