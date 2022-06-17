import { HttpClient} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {

  url = 'https://api.openweathermap.org/data/2.5/onecall';
  API_KEY = '950f2681a63d5078132698616b285ffd';

  constructor(private httpClient: HttpClient) { }

  getWeatherData(latitude: number, longitude: number): Observable<any>{
    return this.httpClient.get(`${this.url}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.API_KEY}`);
  }
}
