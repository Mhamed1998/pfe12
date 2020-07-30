import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public domainURL = 'http://localhost:3000/';
  public assetsURL = 'https://25bol.brilienzacademy.in/';
  public configURL = 'https://www.daijiworld.com/';

  constructor(private http: HttpClient) { }

  getData(url): Observable<any> {
    // console.log(this.http.get(url));
    return this.http.get(url);
  }

}
