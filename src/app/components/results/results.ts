import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Puntaje } from '../../services/puntaje/puntaje';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.html',  
  styleUrl: './results.css'
})
export class Results implements OnInit {
  puntos: number = 0
  nombre: string = '';

  constructor(private router: Router, private puntajeservice: Puntaje) {}

  ngOnInit(): void {
    this.puntos = this.puntajeservice.getPuntaje()
    this.nombre = this.puntajeservice.getNombreJugador();
  }
  playAgain() {
    this.router.navigate(['/questions']);
  }

   exitGame() {
    this.router.navigate(['']);
  }

}
