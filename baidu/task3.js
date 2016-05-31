// Use to generate test dataset
function getDataStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var dataStr = '';
    for (var i = 1; i < 92; i++) {
        dataStr = getDataStr(dat);
        returnData[dataStr] = Math.ceil(Math.random()*seed);
        dat.setDate(dat.getDate()+1);
    }
    return returnData;
}

var aqiSourceData = {
    "Beijing": randomBuildData(500),
    "Shanghai": randomBuildData(300),
    "Guangzhou": randomBuildData(200),
    "Shenzhen": randomBuildData(100),
    "Chengdu": randomBuildData(300),
    "Xian": randomBuildData(500),
    "Fuzhou": randomBuildData(100),
    "Xiamen": randomBuildData(100),
    "Shenyang": randomBuildData(500)
};

//data used to render chart
 
var chartData = {};

// Record current choice
var pageState = {
    nowSelectedCity : -1,
    nowGraTime: "day"
};

var $ = function(id){
    return document.getElementById(id);
}

/**
 * Use to render chart
 */
function renderData() {
    var ctx = $("char-bar").getContext("2d");
    BarGraph(ctx);
}


function BarGraph(ctx) {
    this.height = window.innerHeight-200;
    this.width = window.innerWidth-200;
    
    var numberOfBars = Object.keys(chartData).length;
    var barHeight;
    var barWidth;
    var maxBarHeight;

    //check if dimension of canvas need to be updated
    if(ctx.canvas.width !== this.width || ctx.canvas.height !== this.height) {
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
    }

    ctx.fillStyle = "#FFF0F5";
    ctx.fillRect(0, 0, this.width, this.height);

    // calculate dimension of bar
    barWidth = this.width / numberOfBars * 0.8;
    this.margin = this.width / numberOfBars * 0.1;
    maxBarHeight = this.height - 25;

    // Find the maximum value of the array
    var maxVal = 0;
    for (key in chartData) {
        if(chartData[key] > maxVal) {
            maxVal = chartData[key];
        }
    }
    //console.log(maxVal);
    // Draw each bar
    var barCnt = 0;
    for (var key in chartData) {
        barHeight = chartData[key] / maxVal * maxBarHeight;
        //console.log(barHeight);
        ctx.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

        ctx.fillRect(this.margin + barCnt * this.width / numberOfBars, 
            this.height-barHeight, barWidth, barHeight);

        barCnt += 1;
    }
}


function graTimeChange() {
    var time = $("form-gra-time").elements["gra-time"];

    var currentUnit;
    for(var i = 0; i < time.length; i++) {
        if(time[i].type === "radio" && time[i].checked) {
            currentUnit = time[i].value;
        }
    } 

    pageState["nowGraTime"] = currentUnit;
    //console.log(currentUnit);
    //console.log(pageState);

    initAqiCharterData();
}

function citySelectChange() {
    var city = $("city-select").options[$("city-select").selectedIndex].value;
    pageState["nowSelectedCity"] = city;
    //console.log(city);
    //console.log(pageState);

    initAqiCharterData();
}


/**
 * Initilize the web page
 */
function initGraTimeForm() {
    //call when click radios
    pageState["nowGraTime"] = "day";

    // add listener to this fiedset
    $("form-gra-time").addEventListener("change", graTimeChange);
}

function initCitySelector() {
    for (city in aqiSourceData) {
        var option = document.createElement("option");
        option.text = city;
        option.value = city;
        $("city-select").add(option);
    }

    pageState["nowSelectedCity"] = "Beijing";

    $("city-select").addEventListener("change", citySelectChange);
}

function initAqiCharterData() {
    var sourceData = aqiSourceData[pageState["nowSelectedCity"]];
    
    if (pageState["nowGraTime"] === "day") {
        chartData = sourceData;
    } else if(pageState["nowGraTime"] === "week") {
        var cnt = 0;
        chartData = {};
        for (key in sourceData) {
            var str = "2016, " + (Math.floor(cnt/7)+1) + " week";
            if (cnt % 7 == 0) {
                chartData[str] = sourceData[key];
            } else {
                chartData[str] += sourceData[key];
            }
            cnt += 1;
        }
        for (key in chartData) {
            chartData[key] = Math.floor(chartData[key]/7);
        }
    } else {
        chartData = {
            "2015, Dec" : 0,
            "2016, Jan" : 0,
            "2016, Feb" : 0,
            "2016, Mar" : 0
        }

        var cnt1 = 0, cnt2 = 0, cnt3 = 0, cnt4 = 0;
        for (key in sourceData) {
            if (key.startsWith("2015-12")) {
                chartData["2015, Dec"] += sourceData[key];
                cnt1 += 1;
            } else if(key.startsWith("2016-01")) {
                chartData["2016, Jan"] += sourceData[key];
                cnt2 += 1;
            } else if(key.startsWith("2016-02")) {
                chartData["2016, Feb"] += sourceData[key];
                cnt3 += 1;
            } else {
                chartData["2016, Mar"] += sourceData[key];
                cnt4 += 1;
            }
        }

        chartData["2015, Dec"] = Math.floor(chartData["2015, Dec"]/cnt1);
        chartData["2016, Jan"] = Math.floor(chartData["2016, Jan"]/cnt2);
        chartData["2016, Feb"] = Math.floor(chartData["2016, Feb"]/cnt3);
        chartData["2016, Mar"] = Math.floor(chartData["2016, Mar"]/cnt4);
    }

    //console.log(chartData);
    renderData();
}

function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiCharterData();
    //window.addEventListener('resize', renderData());
}

