import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Jugador } from '../../modelos/jugador';
import { RankingService } from '../../services/ranking/ranking';

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking implements OnInit {
  puntajes: Jugador[] = [];

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.rankingService.obtenerRanking().subscribe({
      next: (jugadores) => {
        this.puntajes = jugadores;
        console.log('✅ Ranking recibido:', this.puntajes);
      },
      error: (error) => {
        console.error('Error al cargar el ranking:', error);
      },
    });
  }
}
