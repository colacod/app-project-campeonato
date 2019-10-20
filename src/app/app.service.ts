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

  getGrupos() {
    return this.get('/grupo/get');
  }

  getGruposPlayoff() {
    return this.get('/grupo/playoff/get');
  }

  getTimesGrupo(idGrupo, idCampeonato) {
    return this.get(`/grupo/vinculo/get/${idGrupo}/campeonato/${idCampeonato}`);
  }

  getTimesPlayoff(idGrupo, idCampeonato) {
    return this.get(`/playoff/get/${idGrupo}/campeonato/${idCampeonato}`);
  }

  getResultadoPorGrupoCampeonato(idGrupo, idCampeonato) {
    return this.get(`/resultado/get/campeonato/${idCampeonato}/grupo/${idGrupo}`);
  }

  getTimes() {
    return this.get('/time/get');
  }

  getTimesCampeonato(idCampeonato) {
    return this.get(`/grupo/vinculo/times/${idCampeonato}`);
  }

  criarFaseGrupo(idCampeonato: any) {
    return this.get(`/campeonato/criar/grupo/${idCampeonato}`);
  }

  setTime(time: any) {
    return this.put('/time/set', time);
  }

  setCampeonato(campeonato: any) {
    return this.put('/campeonato/set', campeonato);
  }

  setResultado(resultado: any) {
    return this.put('/resultado/set', resultado);
  }

  setPlayoffSequence(idCampeonato: any, idGrupo: any, idProximoGrupo: any) {
    return this.put(
      `/campeonato/criar/sequence/campeonato/${idCampeonato}/grupo/${idGrupo}/proximogrupo/${idProximoGrupo}`
    );
  }

  setPlayoff(idCampeonato: any, idProximoGrupo: any) {
    return this.put(
      `/campeonato/criar/playoff/campeonato/${idCampeonato}/proximogrupo/${idProximoGrupo}`
    );
  }
}
