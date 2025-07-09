import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from '../../modelos/jugador';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

    //private baseUrl = 'http://localhost:3000/score'; 
    private baseUrl = 'https://kuf0ha66z0.execute-api.us-east-1.amazonaws.com/score'; // URL de nube


  constructor( private http : HttpClient) { }

  obtenerRanking(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${this.baseUrl}/ranking`);
  }

  reiniciarRanking(){
    return this.http.delete(`${this.baseUrl}/reiniciar`);
  }

}
