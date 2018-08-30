const express = require('express');
const app = express();

let request = require('request');
let name = "";
let region = "";
let country = "";
let latitude = "";
let longitude = "";
let localtime = "";
let celsius = "";
let farenheit = "";
let humidity = "";
let km = "";
let miles = "";

function getCurrentWeather(cityName){
  let apiKey = 'dec31a85e9894f879fa184614182908';
  let url = `http://api.apixu.com/v1/current.json?key=${apiKey}&q=${cityName}`;

  request(url, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body);
      name = weather.location.name;
      region = weather.location.region;
      country = weather.location.country;
      latitude = weather.location.lat;
      longitude = weather.location.lon;
      localtime = weather.location.localtime;
      celsius = weather.current.temp_c;
      farenheit = weather.current.temp_f;
      humidity = weather.current.humidity;
      km = weather.current.vis_km;
      miles = weather.current.vis_miles;
      console.log('weather:', weather);
      console.log('body:', body);
      createPdf();
    }
  });
}

app.listen(3000, function () {
  console.log('listening on port 3000')
})

app.get('/weather/:cityName', function (req, res) {
  console.log(req.url);
  var str = req.url;
  var res = str.substring(1);
  if(res!=0){
    cityName = res;
   console.log('City------>'+cityName);
    getCurrentWeather(cityName);
  }
});

function createPdf(){
  var pdf = require('pdfkit');
  var fs = require('fs');

  var myDoc = new pdf;

  myDoc.pipe(fs.createWriteStream(name+region+'.pdf'));

  myDoc.font('Times-Roman')
        .fontSize(20)
        .text('City Name: '+name + '\n' + 'Region: '+ region + '\n' +
               'Country: ' + country + '\n' + 'Latitude: ' + latitude +
               '\n' + 'Longitude: ' + longitude + '\n' + 'Farenheit: ' + farenheit
               + '\n' + 'Celsius: '+ celsius + '\n' + 'Humidity: ' + humidity +
               '\n' + 'Speed KM: ' + km + '\n' + 'Speed Miles: ' + miles , 50,50);

  myDoc.end(); 
}