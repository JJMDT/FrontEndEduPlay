import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Jugador {
  nombre: string;
  puntos: number;
};

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './ranking.html',
  styleUrl: './ranking.css'
})
export class Ranking implements OnInit {

  puntajes: Jugador[] = [];
  constructor (private http: HttpClient) {}
  ngOnInit() {
    this.http.get<any[]>('http://eduplay.us-east-1.elasticbeanstalk.com/score/ranking')
    .subscribe(datos => {
      // console.log('recibiendo datos: ',datos)
      this.puntajes = datos
    })
  }
}
