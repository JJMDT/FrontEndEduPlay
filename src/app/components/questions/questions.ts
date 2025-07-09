import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pregunta } from '../../modelos/pregunta.model';
import { PuntosResultado } from '../../modelos/puntosResultado.model';
import { Router } from '@angular/router';
import { Puntaje } from '../../services/puntaje/puntaje';
import { PreguntasService } from '../../services/preguntas/pregunta';

@Component({
  selector: 'app-questions',
  imports: [CommonModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions implements OnInit {
  //contantes
  readonly TOTAL_PREGUNTAS = 10;
  readonly PUNTOS_POR_RESPUESTA = 10;
  readonly TIEMPO_FEEDBACK = 2000; // Tiempo en milisegundos para mostrar el feedback

  // Propiedades del componente
  pregunta!: Pregunta;
  preguntas: Pregunta[] = []; 
  indicePreguntaActual: number = 0;
  respuestaUsuario: string = '';
  mensajeFeedback: string = '';
  esCorrecta: boolean = false;

  //controladores

  contadorCorrectas: number = 0;
  contadorPreguntas: number = 1;
  juegoTerminado: boolean = false; 

  //resultados
  resultado!: PuntosResultado;
  puntosTotales: number = 0;

  constructor(
    private route: Router,
    private puntajeServices: Puntaje,
    private preguntasService: PreguntasService
  ) {}

  ngOnInit(): void {
    this.cargarPregunta();
  }

  private cargarPregunta(): void {
    this.preguntasService.preguntasAleatorias(this.TOTAL_PREGUNTAS).subscribe({
      next: (preguntas) => {
        console.log('✅ Preguntas recibidas:', preguntas);

        this.preguntas = preguntas;
        this.cargarPreguntaActual();
      },
      error: (error) => {
        console.error('Error al cargar la pregunta:', error);
        this.mensajeFeedback =
          'Error al cargar las preguntas. Verifica que el servidor esté ejecutándose.';
      },
    });
  }

  /**
   * Carga la pregunta actual del array
   */
  private cargarPreguntaActual(): void {
    if (
      this.preguntas.length > 0 &&
      this.indicePreguntaActual < this.preguntas.length
    ) {
      this.pregunta = this.preguntas[this.indicePreguntaActual];
    }
  }

  verificarRespuesta(opcion: string): void {
    if (this.juegoTerminado || this.respuestaUsuario !== '') {
      return;
    }

    this.respuestaUsuario = opcion;
    if (opcion === this.pregunta.respuestaCorrecta) {
      this.mensajeFeedback = 'Respuesta correcta';
      this.esCorrecta = true;
      this.contadorCorrectas++;
      this.puntosTotales += this.PUNTOS_POR_RESPUESTA;
    } else {
      this.mensajeFeedback = 'Respuesta incorrecta';
      this.esCorrecta = false;
    }

    // Verificar si es la última pregunta ANTES del setTimeout
    if (this.contadorPreguntas >= this.TOTAL_PREGUNTAS) {
      // Es la última pregunta, finalizar el juego
      setTimeout(() => {
        this.finalizarJuego();
      }, this.TIEMPO_FEEDBACK);
    } else {
      // No es la última pregunta, continuar
      setTimeout(() => {
        this.siguientePregunta();
      }, this.TIEMPO_FEEDBACK);
    }
  }

  /**
   * Avanza a la siguiente pregunta
   */
  private siguientePregunta(): void {
    if (this.contadorPreguntas < this.TOTAL_PREGUNTAS && !this.juegoTerminado) {
      this.indicePreguntaActual++;
      this.contadorPreguntas++;
      this.limpiarEstado();
      this.cargarPreguntaActual();
    }
  }

  /**
   * Limpia el estado para la siguiente pregunta
   */
  private limpiarEstado(): void {
    this.mensajeFeedback = '';
    this.respuestaUsuario = '';
    this.esCorrecta = false;
  }

  private finalizarJuego(): void {
    this.juegoTerminado = true; // ← Marcar que el juego terminó

    console.log('Juego terminado:', {
      correctas: this.contadorCorrectas,
      total: this.TOTAL_PREGUNTAS,
      puntos: this.puntosTotales,
    });
      // Actualizar puntos en el servicio
  this.puntajeServices.setpuntaje(this.puntosTotales);
  
  // Enviar puntos
  this.enviarPuntos();

    // Navegar a resultados después de 3 segundos
    setTimeout(() => {
      // this.route.navigate(['/resultados']);
      this.route.navigate(['/resultados']);
    }, 3000);
  }

  enviarPuntos():void {
   this.puntajeServices.setpuntaje(this.puntosTotales);
   this.puntajeServices.enviarPuntos().subscribe({
      next: (resultado) => {
        this.resultado = resultado;
        console.log('Puntos enviados:', this.resultado);
      }, error: (error) => {
        console.error('Error al enviar puntos:', error);
        this.mensajeFeedback = 'Error al enviar los puntos. Inténtalo de nuevo más tarde.';
      }
    })
  }
}
