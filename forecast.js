hourly = JSON.parse(sessionStorage.getItem('hrs'));
daily = JSON.parse(sessionStorage.getItem('daily'));
desc = JSON.parse(sessionStorage.getItem('desc'));
icons = JSON.parse(sessionStorage.getItem('icon'));
weather = JSON.parse(sessionStorage.getItem('weather'));

day=['SUN','MON','TUE','WED','THU','FRI','SAT'];
month=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC']
date=new Date();
u='°C';
for(var i=0;i<4;i++){
   daily[i].morn=Math.floor(daily[i].morn-273);
   daily[i].day=Math.floor(daily[i].day-273);
   daily[i].eve=Math.floor(daily[i].eve-273);
   daily[i].night=Math.floor(daily[i].night-273);
}
flag=0;
up=0;
function changeunit() {
   if (flag == 0) {
       for(var upp=0;upp<4;upp++){
         daily[upp].morn = Math.floor((daily[upp].morn * 9 / 5) + 32);
         daily[upp].day = Math.floor((daily[upp].day * 9 / 5) + 32);
         daily[upp].eve = Math.floor((daily[upp].eve * 9 / 5) + 32);
         daily[upp].night = Math.floor((daily[upp].night * 9 / 5) + 32);
       }
       flag = 1;
       u= "°F";
       d(up)
   } else {
       flag = 0;
       for(var upp=0;upp<4;upp++){
         daily[upp].morn = Math.floor((daily[upp].morn  - 32) * 5 / 9);
         daily[upp].day = Math.floor((daily[upp].day - 32) * 5 / 9);
         daily[upp].eve = Math.floor((daily[upp].eve - 32) * 5 / 9);
         daily[upp].night = Math.floor((daily[upp].night - 32) * 5 / 9);
       }
       u = "°C";
       d(up);
   }
}



function dailyforecast(){
   document.getElementById('c1').style.display="none";
   document.getElementById('dayBut').style.display='none';
   document.getElementById('choice').style.display="";
   document.getElementById('c2').style.display="";
   //document.getElementById('temp').innerHTML="<td>Temperature °C </td><td>"+daily[0].morn+"</td><td>"+daily[0].day+"</td><td>"+daily[0].eve+"</td><td>"+daily[0].night+"</td>";
   document.getElementById('1').innerHTML=date.getDate()+"-"+month[date.getMonth()]+" , "+day[date.getDay()];
   date.setDate(date.getDate()+1)
   document.getElementById('2').innerHTML=date.getDate()+"-"+month[date.getMonth()]+" , "+day[date.getDay()];
   date.setDate(date.getDate()+1)
   document.getElementById('3').innerHTML=date.getDate()+"-"+month[date.getMonth()]+" , "+day[date.getDay()];
   date.setDate(date.getDate()+1)
   document.getElementById('4').innerHTML=date.getDate()+"-"+month[date.getMonth()]+" , "+day[date.getDay()];
   d(0)
}

function closeWind(){
   document.getElementById('c2').style.display="none";
   document.getElementById('choice').style.display='none';
   document.getElementById('dayBut').style.display="";
   document.getElementById('c1').style.display="";
}



temp=0;
function d(n){
   up=n;
   var id="t"+n
   document.getElementById(id).style.backgroundColor='blue';

   if ( weather[n].split(';')[2]== "clear sky"|| weather[n].split(';')[2]=="Clear") {
      var ic = icons.sun;
  } else if( weather[n].split(';')[2]=="few clouds"|| weather[n].split(';')[2]=="Clouds"|| weather[n].split(';')[2]=="scattered clouds"){ 
      ic = icons.cloud;}
      else if( weather[n].split(';')[2]=="Rain"){ic = icons.rain;}
      else if( weather[n].split(';')[2]=="--"){ic= icons.none;}
      else if( weather[n].split(';')[2]=="Thunderstorm"){ic= icons.thunderstorm;}
      else{ic= icons.snow;}
      document.getElementById("icon").innerHTML =ic+ weather[n].split(';')[2];



   htm="<tr><th></th><th>Morning</th><th>Afternoon</th><th>Evening</th><th>Night</th></tr>";
   htm+="<tr onclick='changeunit()'><td>Temperature "+u+"</td><td>"+daily[n].morn+"</td><td>"+daily[n].day+"</td><td>"+daily[n].eve+"</td><td>"+daily[n].night+"</td></tr>";
   htm+="<tr></tr>"
   htm+="<tr><td></td><td>Wind :</td><td>"+weather[n].split(';')[1]+" kmph</td><td></td><td>Humidity: </td><td>"+weather[n].split(';')[0]+"%</td></tr>";
   htm+="<tr></tr><tr><td></td><td></td><td></td><td>Pressure :</td><td>"+weather[n].split(';')[3]+"</td></tr>"
   if(n!=temp){
      id="t"+temp
   document.getElementById(id).style.backgroundColor="rgba(0,0,0,0)"
   temp=n;
   }
   document.getElementById('temp').innerHTML=htm;
}



























function drawGraph() {
   let myChart = document.getElementById('mychart').getContext('2d');
   let c = new Chart(myChart,
      {
         type: 'line',
         data: 
            {
               labels: desc,
               datasets: [{
                  label: 'Temperature °C',
                  data: hourly,
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderColor: 'yellow',
                  pointRadius: 4,
                  pointBackgroundColor: 'yellow',
                  pointHoverRadius: 6,
                  pointHoverBorderColor: 'red',
                  pointHoverBackgroundColor: 'red',
               }]
            },
         options: {
            legend:{
               display:false
            },
            responsive: false,
            scales: {
               xAxes: [{
                  id: 'a1',
                  gridLines: {
                     display: false,
                     drawBorder:false
                  },
                  ticks: {
                     fontColor: 'white',
                     labelOffset: 20,
                     callback:function(label){
                        return label.split(';')[1];
                      }
                  }
               },
               {
                  id: 'a2',
                  position: 'top',
                  gridLines: {
                     display: false,
                     drawBorder:false
                  },
                  ticks: {
                     fontColor: 'white',
                     labelOffset: 20,
                     callback:function(label){
                        return label.split(';')[2];
                      }
                  }
               },
               {
                  id: 'a3',
                  gridLines: {
                     display: false,
                     drawBorder:false
                  },
                  ticks: {
                     fontColor: 'white',
                     labelOffset: 20,
                     callback:function(label){
                        return (label.split(';')[0]);
                      }
                  }
               }
               ],
               yAxes: [{
                  gridLines: {
                     display: false,
                     drawBorder:false
                  },
                  ticks: {
                     fontColor: 'white',
                  }
               }]
            }
         },
      });
}