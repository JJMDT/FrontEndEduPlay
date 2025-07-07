import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuntosResultado } from '../../modelos/puntosResultado.model';

@Injectable({
  providedIn: 'root'
})
export class Puntaje {

  private puntosTotales: number = 0;
  private nombreJugador: string = 'anonimo';

  private baseUrl = 'http://localhost:3000/pregunta/puntuacion'; 

  constructor(private http: HttpClient) { }

  enviarPuntos(): Observable<PuntosResultado> {
    const body = {
      puntos: this.puntosTotales,
      nombre: this.nombreJugador,
    };
    
    return this.http.post<PuntosResultado>(this.baseUrl, body);
  }

  setpuntaje(puntos:number): void{
    this.puntosTotales = puntos
  }

  getPuntaje(): number{
    return this.puntosTotales;
  }

  setNombreJugador(nombre: string): void {
    this.nombreJugador = nombre.trim() || 'anonimo';
  }
  getNombreJugador(): string {
    return this.nombreJugador;
  }

}

