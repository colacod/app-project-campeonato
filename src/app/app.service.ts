import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  headers: HttpHeaders;
  options: object;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private getService(url: string, body: any, request: string) {
    this.options = {
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.http.request(request, env.apiUrl + url, this.options);
  }

  get(url: string, body?: any) {
    return this.getService(url, body, 'get');
  }

  post(url: string, body?: any) {
    return this.getService(url, body, 'post');
  }

  put(url: string, body?: any) {
    return this.getService(url, body, 'put');
  }

  getCampeonatos() {
    return this.get('/campeonato/get');
  }

  getTimes() {
    return this.get('/time/get');
  }

  getTimesCampeonato(idCampeonato) {
    return this.get(`/grupo/vinculo/times/${idCampeonato}`);
  }

  setTime(time: any) {
    return this.put('/time/set', time);
  }

  setCampeonato(campeonato: any) {
    return this.put('/campeonato/set', campeonato);
  }
}
