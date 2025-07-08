import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from '../../modelos/jugador';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

    private baseUrl = 'http://localhost:3000/score'; 


  constructor( private http : HttpClient) { }

  obtenerRanking(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${this.baseUrl}/ranking`);
  }

  reiniciarRanking(){
    return this.http.delete(`${this.baseUrl}/reiniciar`);
  }

}
