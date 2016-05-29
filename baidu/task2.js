/**
 *  array to store aqi of each cities
 */
var aqiData = {};

var $ = function(id){
    return document.getElementById(id);
}

/**
 * read data from input, render table
 */
function readData() {
    var reg = /^[\u4e00-\u9fa5_a-zA-Z\s]+$/
    var num = parseInt($("aqi-value-input").value.trim());
    var city = $("aqi-city-input").value.trim();

    if(!reg.test(city)) {
        alert("City name can only contain Chinese or English character.")
    }
    else if(isNaN(num) || num < 0 || num > 1000) {
        alert("AQI should be an integer range in (0, 1000)")
    }

    else {
            aqiData[city] = num;

        /* 
        for (var key in aqiData) {
            console.log(key);
            if(!aqiData.hasOwnProperty(key)) {
                continue;
            }
            console.log(aqiData[key]);
        } */  
    }
 }

function renderData() {
    $("aqi-table").innerHTML = "";
    var currentRow = 0;
    for(var city in aqiData) {
        var row = $("aqi-table").insertRow(currentRow);
        row.insertCell(0).innerHTML = city;
        row.insertCell(1).innerHTML = aqiData[city];
        row.insertCell(2).innerHTML = "<button data-city='"+city+"'>delete</button>";
        currentRow += 1;
    }
    if(currentRow != 0) {
        var row = $("aqi-table").insertRow(0);
        row.insertCell(0).innerHTML = "City Name";
        row.insertCell(1).innerHTML = "AQI value";
        row.insertCell(2).innerHTML = "Operator";
    }
}

function addBntHandler() {
    readData();
    renderData();
    $("aqi-city-input").value = "";
    $("aqi-value-input").value = "";
}

function delBntHandler(city) {
    delete aqiData[city];
    renderData();

}

/**
 * Initiate function
 */
 function init() {
    $("add-bnt").addEventListener("click", addBntHandler);

    $("aqi-value-input").addEventListener("keyup", function(event){
        if(event.keyCode == 13) {
            addBntHandler();
        }
    });

    $("aqi-table").addEventListener("click", function(event){
        if(event.target.nodeName.toLowerCase() === "button") {
            delBntHandler(event.target.dataset.city);   
        }
    });
 }

 