/************************************************************************/
			var $ = function(id){
				return document.getElementById(id);
			}

			var handler = function(){
				var num = parseInt($("aqi-input").value)
				if ((!isNaN(num)) && num >= 0 && num <= 1000) {
					$("aqi-display").innerHTML = num; 
				} else {
					alert("Invalid input! Please enter 0-1000 integer!");
				}
			}

			$("button").onclick = function(){
				handler();
			}

			// pass 'event' as parameter can get valuable information about this evenr
			$("aqi-input").onkeyup = function(event){
				if(event.keyCode == 13) { // If "Enter" key is pressed
					handler();
				}
			}

			function submitRes(){
				var text = document.getElementById("aqi-input").value;
				document.getElementById("aqi-display").textContent = text;
			}

			/************************************************************************/
			var getData = function(id) {
				// get all list item
				var lists = $(id).getElementsByTagName("li");
				aqiData = [];
				for(var i = 0; i < lists.length; i++) {
					var num = lists[i].getElementsByTagName("b")[0].innerHTML;
					var name = lists[i].textContent.split(" ")[0];
					aqiData.push([name, parseInt(num)])
				}
				return aqiData;
			}

			var  renderData = function(data, id) {
				$(id).innerHTML = '';
				for(var i = 0; i < data.length; i++) {
					/* ONLY HAVE TEST
					var text = data[i][0] + ":" + data[i][1].toString();
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(text));
					*/
					var li = document.createElement("li");
					li.innerHTML = data[i][0] + " air quality: <b>" + data[i][1] + "</b>"
					$(id).appendChild(li);
				}
			};


			var btnHandle = function(){
				aqiData = getData("source");

				// only select data with aqi > 60
				var selectedData = aqiData.filter(function(item){
					return item[1] > 60;
				})


				// sort data in decreasing order
				selectedData.sort(function(a, b){
					return b[1]-a[1];
				});

				renderData(selectedData, "resort");

				// hide original list
				$("source").style.display = 'none';
			}

			$("sort-btn").onclick = function(){
				btnHandle();
			}			