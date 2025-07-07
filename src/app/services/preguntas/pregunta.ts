
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../../modelos/pregunta.model';


@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  // esta es la url de nube
  //private baseUrl = 'https://kuf0ha66z0.execute-api.us-east-1.amazonaws.com/pregunta';

  private baseUrl = 'http://localhost:3000/pregunta'; // URL local para desarrollo

  constructor(private http: HttpClient) { }

  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.baseUrl}/traerTodas`);
  }

  preguntasAleatorias(cantidad : number = 10 ): Observable<Pregunta[]> {
    const url = `${this.baseUrl}/aleatorias?cantidad=${cantidad}`;
    return this.http.get<Pregunta[]>(url);

  }

  crearPregunta(pregunta: Pregunta): Observable<Pregunta[]> {
    return this.http.post<Pregunta[]>(`${this.baseUrl}/crear`, pregunta); 
  }

  eliminarPregunta(id: string): Observable<Pregunta[]> {
    return this.http.delete<Pregunta[]>(`${this.baseUrl}/${id}`);
  }

  actualizarPregunta(id: string, pregunta: Pregunta): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, pregunta);
}

}
