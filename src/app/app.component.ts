import { Component } from '@angular/core';
import { WeatherServiceService } from './services/weather-service.service';
import * as moment from 'moment';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import locations from './data/locations.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  latitude: number;
  longitude: number;
  climateDetails: any;
  selectedLocation = 'Kochi';
  locationArray: string[] = [];
  location: any;
  dailyWeather: any;
  currentWeather: any;
  hourlyWeather: any;
  currentWeatherExtracted: any;
  dailytWeatherExtracted: any[] = [];
  status = 'LOADING'

  lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0, 0, 0, 0)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0, 0, 0, 0)'
                }
            }]
      }
  };
  lineChartColors: Color[] = [
      {
          borderColor: '#2a4250'
      }
  ];
  lineChartData: ChartDataSets[] = [
      { data: [] },
  ];
  lineChartLabels: Label[] = [];

  constructor(private weatherService: WeatherServiceService){

  }
  ngOnInit(){
    this.locationArray = locations.map((loc) => {
      return loc.name;
    })
    this.getWeatherData();
  }

  getWeatherData() {
    this.status = 'LOADING'
    this.currentWeather = {};
    this.dailytWeatherExtracted = [];
    this.lineChartData[0].data = [];
    locations.forEach(element => {
      if(element.name === this.selectedLocation){
        this.location = element;
      }
    });
    this.weatherService.getWeatherData(this.location.latitude, this.location.longitude).subscribe(
      (data) => {
        this.climateDetails = data;
        this.currentWeather = this.climateDetails.current;
        this.hourlyWeather = this.climateDetails.hourly;
        this.currentWeatherExtracted = {
            pressure: this.currentWeather.pressure,
            humidity: this.currentWeather.humidity,
            temperature: this.currentWeather.temp,
            wind_speed: this.currentWeather.wind_speed,
            main_Weather: this.currentWeather.weather[0].main,
            description_Weather: this.currentWeather.weather[0].description,
            icon: `http:/openweathermap.org/img/wn/${this.currentWeather.weather[0].icon}.png`
        };
        this.dailyWeather = this.climateDetails.daily;
        this.dailyWeather.forEach(day => {
          this.dailytWeatherExtracted.push({
              pressure: day.pressure,
              humidity: day.humidity,
              temp_day: day.temp.day,
              temp_night: day.temp.night,
              temp_max: day.temp.max,
              temp_min: day.temp.min,
              main_Weather: day.weather[0].main,
              desc: day.weather[0].main,
              day: moment(day.dt * 1000).format('dddd'),
              icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`
          });
        });
        this.climateDetails.hourly.slice(24).forEach((hour) => {
          this.lineChartLabels.push(moment(hour.dt * 1000).format('HH:mm'));
          this.lineChartData[0].data.push(hour.temp);
        });
        this.status = 'COMPLETE'
      },
      (error)=>{
        console.log('error',error);
      })
  }

}
